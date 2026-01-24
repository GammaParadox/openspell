-- Packet audit + item/shop tracking tables

CREATE TABLE "invalid_packet_events" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "serverId" INTEGER,
    "actionType" INTEGER,
    "packetName" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "payloadSample" JSONB,
    "details" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "invalid_packet_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "invalid_packet_event_rollups" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "serverId" INTEGER,
    "actionType" INTEGER,
    "packetName" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "bucketStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "invalid_packet_event_rollups_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "packet_trace_files" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "serverId" INTEGER,
    "bucketStart" TIMESTAMP(3) NOT NULL,
    "bucketEnd" TIMESTAMP(3) NOT NULL,
    "packetCount" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "byteCount" INTEGER NOT NULL,
    "sha256" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "packet_trace_files_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "item_drop_events" (
    "id" SERIAL NOT NULL,
    "dropperUserId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "amount" BIGINT NOT NULL,
    "isIOU" INTEGER NOT NULL DEFAULT 0,
    "mapLevel" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "serverId" INTEGER,
    "groundItemId" INTEGER,
    "droppedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "item_drop_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "item_pickup_events" (
    "id" SERIAL NOT NULL,
    "pickerUserId" INTEGER NOT NULL,
    "dropperUserId" INTEGER,
    "itemId" INTEGER NOT NULL,
    "amount" BIGINT NOT NULL,
    "isIOU" INTEGER NOT NULL DEFAULT 0,
    "mapLevel" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "serverId" INTEGER,
    "groundItemId" INTEGER,
    "pickedUpAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "item_pickup_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "shop_item_sale_events" (
    "id" SERIAL NOT NULL,
    "sellerUserId" INTEGER NOT NULL,
    "buyerUserId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "priceEach" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "serverId" INTEGER,
    "soldAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shop_item_sale_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "invalid_packet_event_rollups_unique" ON "invalid_packet_event_rollups"("userId", "serverId", "actionType", "packetName", "reason", "bucketStart");

CREATE INDEX "invalid_packet_events_userId_idx" ON "invalid_packet_events"("userId");
CREATE INDEX "invalid_packet_events_serverId_idx" ON "invalid_packet_events"("serverId");
CREATE INDEX "invalid_packet_events_actionType_idx" ON "invalid_packet_events"("actionType");
CREATE INDEX "invalid_packet_events_packetName_idx" ON "invalid_packet_events"("packetName");
CREATE INDEX "invalid_packet_events_occurredAt_idx" ON "invalid_packet_events"("occurredAt");
CREATE INDEX "invalid_packet_events_payloadHash_idx" ON "invalid_packet_events"("payloadHash");

CREATE INDEX "invalid_packet_event_rollups_userId_idx" ON "invalid_packet_event_rollups"("userId");
CREATE INDEX "invalid_packet_event_rollups_serverId_idx" ON "invalid_packet_event_rollups"("serverId");
CREATE INDEX "invalid_packet_event_rollups_actionType_idx" ON "invalid_packet_event_rollups"("actionType");
CREATE INDEX "invalid_packet_event_rollups_packetName_idx" ON "invalid_packet_event_rollups"("packetName");
CREATE INDEX "invalid_packet_event_rollups_bucketStart_idx" ON "invalid_packet_event_rollups"("bucketStart");

CREATE INDEX "packet_trace_files_userId_idx" ON "packet_trace_files"("userId");
CREATE INDEX "packet_trace_files_serverId_idx" ON "packet_trace_files"("serverId");
CREATE INDEX "packet_trace_files_bucketStart_idx" ON "packet_trace_files"("bucketStart");
CREATE INDEX "packet_trace_files_bucketEnd_idx" ON "packet_trace_files"("bucketEnd");

CREATE INDEX "item_drop_events_dropperUserId_idx" ON "item_drop_events"("dropperUserId");
CREATE INDEX "item_drop_events_itemId_idx" ON "item_drop_events"("itemId");
CREATE INDEX "item_drop_events_groundItemId_idx" ON "item_drop_events"("groundItemId");
CREATE INDEX "item_drop_events_droppedAt_idx" ON "item_drop_events"("droppedAt");

CREATE INDEX "item_pickup_events_pickerUserId_idx" ON "item_pickup_events"("pickerUserId");
CREATE INDEX "item_pickup_events_dropperUserId_idx" ON "item_pickup_events"("dropperUserId");
CREATE INDEX "item_pickup_events_itemId_idx" ON "item_pickup_events"("itemId");
CREATE INDEX "item_pickup_events_groundItemId_idx" ON "item_pickup_events"("groundItemId");
CREATE INDEX "item_pickup_events_pickedUpAt_idx" ON "item_pickup_events"("pickedUpAt");

CREATE INDEX "shop_item_sale_events_sellerUserId_idx" ON "shop_item_sale_events"("sellerUserId");
CREATE INDEX "shop_item_sale_events_buyerUserId_idx" ON "shop_item_sale_events"("buyerUserId");
CREATE INDEX "shop_item_sale_events_shopId_idx" ON "shop_item_sale_events"("shopId");
CREATE INDEX "shop_item_sale_events_itemId_idx" ON "shop_item_sale_events"("itemId");
CREATE INDEX "shop_item_sale_events_soldAt_idx" ON "shop_item_sale_events"("soldAt");

ALTER TABLE "invalid_packet_events"
ADD CONSTRAINT "invalid_packet_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "invalid_packet_event_rollups"
ADD CONSTRAINT "invalid_packet_event_rollups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "packet_trace_files"
ADD CONSTRAINT "packet_trace_files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "item_drop_events"
ADD CONSTRAINT "item_drop_events_dropperUserId_fkey" FOREIGN KEY ("dropperUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "item_pickup_events"
ADD CONSTRAINT "item_pickup_events_pickerUserId_fkey" FOREIGN KEY ("pickerUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "item_pickup_events"
ADD CONSTRAINT "item_pickup_events_dropperUserId_fkey" FOREIGN KEY ("dropperUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "shop_item_sale_events"
ADD CONSTRAINT "shop_item_sale_events_sellerUserId_fkey" FOREIGN KEY ("sellerUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "shop_item_sale_events"
ADD CONSTRAINT "shop_item_sale_events_buyerUserId_fkey" FOREIGN KEY ("buyerUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
