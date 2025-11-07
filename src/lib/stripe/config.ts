/**
 * BilanCompetence.AI - Stripe Configuration
 */

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const STRIPE_PRODUCTS = {
  STARTER: {
    id: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
    name: 'Starter',
    monthlyPrice: 49,
    bilansLimit: 10,
    features: [
      'Jusqu\'à 10 bilans actifs',
      'Fonctionnalités essentielles',
      'Messagerie interne',
      'Génération PDF',
      'Support email',
    ],
  },
  PROFESSIONAL: {
    id: process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_professional',
    name: 'Professional',
    monthlyPrice: 149,
    bilansLimit: 50,
    features: [
      'Jusqu\'à 50 bilans actifs',
      'Toutes les fonctionnalités',
      'Analyse IA avancée',
      'Support prioritaire',
      'Branding personnalisé',
      'Rapports détaillés',
    ],
  },
  ENTERPRISE: {
    id: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    name: 'Enterprise',
    monthlyPrice: 499,
    bilansLimit: -1, // Unlimited
    features: [
      'Bilans illimités',
      'Toutes les fonctionnalités',
      'API access',
      'SSO (Single Sign-On)',
      'Support dédié',
      'Formation sur site',
      'SLA garanti',
    ],
  },
}

export const STRIPE_WEBHOOK_EVENTS = {
  SESSION_COMPLETED: 'checkout.session.completed',
  PAYMENT_SUCCEEDED: 'invoice.payment_succeeded',
  PAYMENT_FAILED: 'invoice.payment_failed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession({
  priceId,
  customerId,
  metadata,
}: {
  priceId: string
  customerId?: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    metadata,
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
  })

  return session
}

/**
 * Create Stripe customer portal session
 */
export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  })

  return session
}

/**
 * Get subscription by customer ID
 */
export async function getSubscription(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  })

  return subscriptions.data[0] || null
}
