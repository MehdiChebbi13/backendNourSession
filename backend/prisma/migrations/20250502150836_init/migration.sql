-- CreateTable
CREATE TABLE "Session" (
    "sid" TEXT NOT NULL,
    "restaurant" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "sid" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "sid" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_sid_idx" ON "Message"("sid");

-- CreateIndex
CREATE INDEX "Order_sid_idx" ON "Order"("sid");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sid_fkey" FOREIGN KEY ("sid") REFERENCES "Session"("sid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sid_fkey" FOREIGN KEY ("sid") REFERENCES "Session"("sid") ON DELETE CASCADE ON UPDATE CASCADE;
