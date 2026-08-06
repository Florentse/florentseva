// Shared between the PrizeWheelDemo component (rendering) and the
// prize-wheel-claim API route (looking up the claimed prize's label), so the
// two never drift out of sync. Every segment is a real, claimable prize —
// with only one spin allowed per visitor, a "Try Again" segment would be a
// dead end.
export const PRIZES = [
  { en: 'Free Shipping', ru: 'Бесплатная доставка' },
  { en: '10% OFF', ru: 'Скидка 10%' },
  { en: 'Free Gift', ru: 'Подарок' },
  { en: '15% OFF', ru: 'Скидка 15%' },
  { en: 'Premium Gift', ru: 'Премиум-подарок' },
  { en: '$20 Credit', ru: 'Кредит $20' },
  { en: 'Free Consultation', ru: 'Бесплатная консультация' },
  { en: 'Buy 1 Get 1', ru: '1+1 в подарок' },
] as const
