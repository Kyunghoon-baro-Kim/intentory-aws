import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';
import { ReviewsModule } from './reviews/reviews.module';
import { InfluencerModule } from './influencer/influencer.module';
import { CollaborationsModule } from './collaborations/collaborations.module';
import { ReferralsModule } from './referrals/referrals.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    InventoryModule,
    ReviewsModule,
    InfluencerModule,
    CollaborationsModule,
    ReferralsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
