# Unit 4: Frontend — Domain Entities (TypeScript Interfaces)

## User
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'admin_a' | 'admin_b' | 'influencer';
}
```

## Product
```typescript
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
}
```

## Order
```typescript
interface Order {
  id: number;
  userId: number;
  subtotal: number;
  gst: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  referralCode?: string;
  createdAt: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}
```

## Review
```typescript
interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  imageUrls: string[];
  createdAt: string;
  user?: { name: string };
}
```

## InfluencerProfile
```typescript
interface InfluencerProfile {
  id: number;
  userId: number;
  channelUrl: string;
  subscribers: number;
  category: string;
  bio?: string;
}
```

## Collaboration
```typescript
interface Collaboration {
  id: number;
  influencerProfileId: number;
  productId: number;
  terms: string;
  compensation?: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'in_progress' | 'completed';
  createdAt: string;
  product?: Product;
}
```

## ReferralLink
```typescript
interface ReferralLink {
  id: number;
  userId: number;
  productId: number;
  code: string;
  createdAt: string;
  product?: Product;
}
```

## Commission
```typescript
interface Commission {
  id: number;
  referralLinkId: number;
  orderId: number;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
}
```

## ReferralStats
```typescript
interface ReferralStats {
  totalLinks: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
}
```
