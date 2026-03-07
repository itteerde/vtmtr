canvas.tokens.ownedTokens.forEach(t => {
    if (t.actor.statuses.find(e => e === 'turn_taken')) {
        t.actor.toggleStatusEffect('turn_taken');
    }
    if (t.actor.statuses.find(e => e === 'discipline_used')) {
        t.actor.toggleStatusEffect('discipline_used');
    }
});