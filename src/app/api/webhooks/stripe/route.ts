/**
 * BilanCompetence.AI - Stripe Webhook Handler
 */

import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_WEBHOOK_EVENTS } from '@/lib/stripe/config'
import { createServiceClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case STRIPE_WEBHOOK_EVENTS.SESSION_COMPLETED: {
        const session = event.data.object as Stripe.Checkout.Session
        const organismeId = session.metadata?.organisme_id
        const priceId = session.metadata?.price_id

        if (!organismeId) break

        // Determine tier from price_id
        let tier: 'starter' | 'professional' | 'enterprise' = 'starter'
        let maxBilans = 10

        if (priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) {
          tier = 'professional'
          maxBilans = 50
        } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
          tier = 'enterprise'
          maxBilans = -1
        }

        await supabase
          .from('organismes')
          .update({
            subscription_tier: tier,
            max_bilans: maxBilans,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq('id', organismeId)

        break
      }

      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED: {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: organisme } = await supabase
          .from('organismes')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!organisme) break

        // Update subscription status
        const isActive = subscription.status === 'active'

        await supabase
          .from('organismes')
          .update({
            is_active: isActive,
          })
          .eq('id', organisme.id)

        break
      }

      case STRIPE_WEBHOOK_EVENTS.SUBSCRIPTION_DELETED: {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: organisme } = await supabase
          .from('organismes')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!organisme) break

        // Downgrade to free tier
        await supabase
          .from('organismes')
          .update({
            subscription_tier: 'free_limited',
            max_bilans: 3,
            is_active: false,
          })
          .eq('id', organisme.id)

        break
      }

      case STRIPE_WEBHOOK_EVENTS.PAYMENT_FAILED: {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: organisme } = await supabase
          .from('organismes')
          .select('id, admin_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!organisme) break

        // TODO: Send email notification to admin

        break
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
