
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      invoices: {
        Row: {
          id: string
          created_at: string
          invoice_number: string
          date: string
          due_date: string | null
          customer_id: string
          subtotal: number
          cgst_total: number
          sgst_total: number
          grand_total: number
          notes: string | null
          status: string
          paid_amount: number | null
          paid_date: string | null
          payment_method: string | null
          vendor_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          invoice_number: string
          date: string
          due_date?: string | null
          customer_id: string
          subtotal: number
          cgst_total: number
          sgst_total: number
          grand_total: number
          notes?: string | null
          status: string
          paid_amount?: number | null
          paid_date?: string | null
          payment_method?: string | null
          vendor_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          invoice_number?: string
          date?: string
          due_date?: string | null
          customer_id?: string
          subtotal?: number
          cgst_total?: number
          sgst_total?: number
          grand_total?: number
          notes?: string | null
          status?: string
          paid_amount?: number | null
          paid_date?: string | null
          payment_method?: string | null
          vendor_id?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          email: string | null
          gst_no: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          email?: string | null
          gst_no?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          email?: string | null
          gst_no?: string | null
          created_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          name: string
          description: string | null
          hsn_code: string
          quantity: number
          weight_in_grams: number | null
          rate_per_gram: number | null
          price: number
          making_charges: number | null
          cgst_rate: number
          sgst_rate: number
          cgst_amount: number
          sgst_amount: number
          total_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          name: string
          description?: string | null
          hsn_code: string
          quantity: number
          weight_in_grams?: number | null
          rate_per_gram?: number | null
          price: number
          making_charges?: number | null
          cgst_rate: number
          sgst_rate: number
          cgst_amount: number
          sgst_amount: number
          total_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          name?: string
          description?: string | null
          hsn_code?: string
          quantity?: number
          weight_in_grams?: number | null
          rate_per_gram?: number | null
          price?: number
          making_charges?: number | null
          cgst_rate?: number
          sgst_rate?: number
          cgst_amount?: number
          sgst_amount?: number
          total_amount?: number
          created_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          email: string
          gst_no: string
          pan_no: string | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_name: string | null
          bank_ifsc: string | null
          bank_branch: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          email: string
          gst_no: string
          pan_no?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bank_ifsc?: string | null
          bank_branch?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          email?: string
          gst_no?: string
          pan_no?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bank_ifsc?: string | null
          bank_branch?: string | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
