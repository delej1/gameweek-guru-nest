-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "fcmToken" VARCHAR(255) NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planName" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Players" (
    "id" SERIAL NOT NULL,
    "fpl_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "teamId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "totalPoints" INTEGER NOT NULL,
    "form" DECIMAL(5,2) NOT NULL,
    "minutes" INTEGER NOT NULL,
    "goalsScored" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "cleanSheets" INTEGER NOT NULL,
    "expectedGoals" DECIMAL(5,2) NOT NULL,
    "expectedAssists" DECIMAL(5,2) NOT NULL,
    "influence" DECIMAL(5,2) NOT NULL,
    "creativity" DECIMAL(5,2) NOT NULL,
    "threat" DECIMAL(5,2) NOT NULL,
    "ictIndex" DECIMAL(5,2) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "chanceOfPlayingNextRound" INTEGER NOT NULL,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" SERIAL NOT NULL,
    "fpl_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "strengthAttack" INTEGER NOT NULL,
    "strengthDefense" INTEGER NOT NULL,
    "strengthOverall" INTEGER NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fixtures" (
    "id" SERIAL NOT NULL,
    "fpl_id" INTEGER NOT NULL,
    "gameweek" INTEGER NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "difficultyHome" INTEGER NOT NULL,
    "difficultyAway" INTEGER NOT NULL,

    CONSTRAINT "Fixtures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerPredictions" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "predictedPoints" DECIMAL(5,2) NOT NULL,
    "predictedGoals" DECIMAL(5,2) NOT NULL,
    "predictedAssists" DECIMAL(5,2) NOT NULL,
    "predictionConfidence" DECIMAL(5,2) NOT NULL,
    "aiReasoning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerPredictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchPredictions" (
    "id" SERIAL NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "confidenceHomeWin" DECIMAL(5,2) NOT NULL,
    "confidenceAwayWin" DECIMAL(5,2) NOT NULL,
    "confidenceDraw" DECIMAL(5,2) NOT NULL,
    "predictedHomeGoals" DECIMAL(5,2) NOT NULL,
    "predictedAwayGoals" DECIMAL(5,2) NOT NULL,
    "aiReasoning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchPredictions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Players_fpl_id_key" ON "Players"("fpl_id");

-- CreateIndex
CREATE UNIQUE INDEX "Teams_fpl_id_key" ON "Teams"("fpl_id");

-- CreateIndex
CREATE UNIQUE INDEX "Fixtures_fpl_id_key" ON "Fixtures"("fpl_id");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerPredictions_playerId_key" ON "PlayerPredictions"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerPredictions_fixtureId_key" ON "PlayerPredictions"("fixtureId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchPredictions_fixtureId_key" ON "MatchPredictions"("fixtureId");

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixtures" ADD CONSTRAINT "Fixtures_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixtures" ADD CONSTRAINT "Fixtures_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPredictions" ADD CONSTRAINT "PlayerPredictions_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPredictions" ADD CONSTRAINT "PlayerPredictions_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixtures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPredictions" ADD CONSTRAINT "MatchPredictions_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixtures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
