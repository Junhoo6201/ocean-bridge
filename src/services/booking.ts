import { supabase } from '@/lib/supabase/client';

export type RequestStatus = 
  | 'new'
  | 'inquiring' 
  | 'pending_payment'
  | 'paid'
  | 'confirmed'
  | 'rejected'
  | 'cancelled';

export interface BookingRequestData {
  product_id: string;
  user_name: string;
  user_phone: string;
  user_email?: string;
  user_kakao_id?: string;
  date: string;
  adult_count: number;
  child_count?: number;
  special_requests?: string;
  pickup_location?: string;
}

export interface BookingRequest extends BookingRequestData {
  id: string;
  status: RequestStatus;
  thread_id?: string;
  total_amount?: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

// Create a new booking request
export async function createBookingRequest(data: BookingRequestData) {
  // Calculate total amount
  const { data: product } = await supabase
    .from('products')
    .select('price_adult_krw, price_child_krw')
    .eq('id', data.product_id)
    .single();

  if (!product) {
    throw new Error('Product not found');
  }

  const totalAmount = 
    (product.price_adult_krw * data.adult_count) + 
    ((product.price_child_krw || product.price_adult_krw) * (data.child_count || 0));

  const { data: request, error } = await supabase
    .from('requests')
    .insert({
      ...data,
      status: 'new',
      total_amount: totalAmount,
      currency: 'KRW',
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating booking request:', error);
    throw error;
  }
  
  // TODO: Trigger Kakao thread creation via Edge Function
  // await createKakaoThread(request.id);
  
  return request as BookingRequest;
}

// Get booking request by ID
export async function getBookingRequest(id: string) {
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      products (
        id,
        title_ko,
        title_ja,
        price_adult_krw,
        price_child_krw,
        duration_minutes,
        category,
        images
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching booking request:', error);
    throw error;
  }

  return data;
}

// Get booking requests by phone number
export async function getBookingsByPhone(phone: string) {
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      products (
        id,
        title_ko,
        title_ja,
        category,
        images
      )
    `)
    .eq('user_phone', phone)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings by phone:', error);
    throw error;
  }

  return data;
}

// Update request status
export async function updateRequestStatus(
  requestId: string, 
  status: RequestStatus,
  notes?: string
) {
  // Validate status transition
  const validTransitions: Record<RequestStatus, RequestStatus[]> = {
    'new': ['inquiring', 'rejected'],
    'inquiring': ['pending_payment', 'rejected'],
    'pending_payment': ['paid', 'cancelled'],
    'paid': ['confirmed', 'cancelled'],
    'confirmed': ['cancelled'],
    'rejected': [],
    'cancelled': [],
  };
  
  // Get current status
  const { data: currentRequest } = await supabase
    .from('requests')
    .select('status')
    .eq('id', requestId)
    .single();

  if (!currentRequest) {
    throw new Error('Request not found');
  }

  const currentStatus = currentRequest.status as RequestStatus;
  
  if (!validTransitions[currentStatus].includes(status)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${status}`);
  }

  // Update status
  const { data, error } = await supabase
    .from('requests')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single();

  if (error) {
    console.error('Error updating request status:', error);
    throw error;
  }

  // Log the status change
  await supabase
    .from('request_logs')
    .insert({
      request_id: requestId,
      action: 'status_change',
      previous_status: currentStatus,
      new_status: status,
      notes,
    });

  return data;
}

// Cancel booking request
export async function cancelBookingRequest(requestId: string, reason?: string) {
  return updateRequestStatus(requestId, 'cancelled', reason);
}

// Get request logs
export async function getRequestLogs(requestId: string) {
  const { data, error } = await supabase
    .from('request_logs')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching request logs:', error);
    throw error;
  }

  return data;
}

// Get dashboard statistics
export async function getDashboardStats(shopId?: string, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let query = supabase
    .from('requests')
    .select('status, total_amount, created_at');

  if (shopId) {
    query = query.eq('product.shop_id', shopId);
  }

  query = query.gte('created_at', startDate.toISOString());

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }

  // Calculate statistics
  const stats = {
    total_requests: data?.length || 0,
    new_requests: data?.filter(r => r.status === 'new').length || 0,
    confirmed_requests: data?.filter(r => r.status === 'confirmed').length || 0,
    cancelled_requests: data?.filter(r => r.status === 'cancelled').length || 0,
    total_revenue: data
      ?.filter(r => ['paid', 'confirmed'].includes(r.status))
      .reduce((sum, r) => sum + (r.total_amount || 0), 0) || 0,
    average_booking_value: 0,
  };

  if (stats.confirmed_requests > 0) {
    stats.average_booking_value = stats.total_revenue / stats.confirmed_requests;
  }

  return stats;
}