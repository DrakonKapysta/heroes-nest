-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Roles" NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Superhero" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "real_name" TEXT NOT NULL,
    "origin_description" TEXT NOT NULL,
    "superpowers" TEXT NOT NULL,
    "catch_phrase" TEXT NOT NULL,
    "images" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_username_email_idx" ON "public"."User"("username", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Superhero_id_key" ON "public"."Superhero"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Superhero_nickname_key" ON "public"."Superhero"("nickname");

-- CreateIndex
CREATE INDEX "Superhero_nickname_real_name_idx" ON "public"."Superhero"("nickname", "real_name");
