export function validatePlayerPredictionResponse(prediction: string): any {
    try {
        // Use regex or JSON parsing to extract data in case of structured response
        const lines = prediction.split('\n');

        const predictedPoints = extractDecimal(lines.find(line => line.includes('Predicted FPL Points')));
        const predictedGoals = extractDecimal(lines.find(line => line.includes('Goal Scoring Probability')));
        const predictedAssists = extractDecimal(lines.find(line => line.includes('Assist Probability')));
        const predictionConfidence = extractDecimal(lines.find(line => line.includes('Prediction Confidence')));
        const reasoning = extractReasoning(lines);

        if (predictedPoints !== null && predictedGoals !== null && predictedAssists !== null && predictionConfidence !== null && reasoning) {
            return {
                predictedPoints,
                predictedGoals,
                predictedAssists,
                predictionConfidence,
                reasoning,
            };
        }

        return null;
    } catch (error) {
        console.error('Failed to validate prediction response:', error);
        return null;
    }
}

export function validateMatchPredictionResponse(prediction: string): any {
    try {
        const lines = prediction.split('\n');

        const confidenceHomeWin = extractDecimal(lines.find(line => line.includes('Home Win')));
        const confidenceAwayWin = extractDecimal(lines.find(line => line.includes('Away Win')));
        const confidenceDraw = extractDecimal(lines.find(line => line.includes('Draw')));
        const predictedHomeGoals = extractDecimal(lines.find(line => line.includes('Home Goals')));
        const predictedAwayGoals = extractDecimal(lines.find(line => line.includes('Away Goals')));
        const reasoning = extractReasoning(lines);

        if (
            confidenceHomeWin !== null &&
            confidenceAwayWin !== null &&
            confidenceDraw !== null &&
            predictedHomeGoals !== null &&
            predictedAwayGoals !== null &&
            reasoning
        ) {
            return {
                confidenceHomeWin,
                confidenceAwayWin,
                confidenceDraw,
                predictedHomeGoals,
                predictedAwayGoals,
                reasoning,
            };
        }

        return null;
    } catch (error) {
        console.error('Failed to validate match prediction response:', error);
        return null;
    }
}

function extractDecimal(line: string): number | null {
    const match = line?.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
}

function extractReasoning(lines: string[]): string {
    return lines.slice(lines.findIndex(line => line.includes('Reasoning'))).join('\n');
}