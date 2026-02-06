/*
  Warnings:

  - A unique constraint covering the columns `[email_confirmation_code]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_email_confirmation_code_key" ON "User"("email_confirmation_code");
