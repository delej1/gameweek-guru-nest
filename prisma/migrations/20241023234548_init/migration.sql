-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "fcmToken" VARCHAR(255) NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planName" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
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
    "ictIndex" DECIMAL(5,2) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "chanceOfPlayingNextRound" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "fpl_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "strengthAttack" DECIMAL(5,2) NOT NULL,
    "strengthDefense" DECIMAL(5,2) NOT NULL,
    "strengthOverall" DECIMAL(5,2) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fixture" (
    "id" SERIAL NOT NULL,
    "fpl_id" INTEGER NOT NULL,
    "gameweek" INTEGER NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "difficultyHome" INTEGER NOT NULL,
    "difficultyAway" INTEGER NOT NULL,

    CONSTRAINT "Fixture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerPrediction" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "predictedPoints" DECIMAL(5,2) NOT NULL,
    "predictedGoals" DECIMAL(5,2) NOT NULL,
    "predictedAssists" DECIMAL(5,2) NOT NULL,
    "predictionConfidence" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchPrediction" (
    "id" SERIAL NOT NULL,
    "fixtureId" INTEGER NOT NULL,
    "predictedResult" VARCHAR(10) NOT NULL,
    "confidenceHomeWin" DECIMAL(5,2) NOT NULL,
    "confidenceAwayWin" DECIMAL(5,2) NOT NULL,
    "confidenceDraw" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MatchPrediction_fixtureId_key" ON "MatchPrediction"("fixtureId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixture" ADD CONSTRAINT "Fixture_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPrediction" ADD CONSTRAINT "PlayerPrediction_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerPrediction" ADD CONSTRAINT "PlayerPrediction_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPrediction" ADD CONSTRAINT "MatchPrediction_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
