game.combat.combatants.contents.forEach(c => {
    console.log({ combatant: c, id: c.actorId, actor: game.actors.get(c.actorId) });
    if (game.actors.get(c.actorId).type === 'vampire') {
        c.update({ "initiative": game.actors.get(c.actorId).getRollData().attributes.dexterity.value + game.actors.get(c.actorId).getRollData().attributes.wits.value })
    }
    if (game.actors.get(c.actorId).type === 'spc') {
        c.update({ "initiative": Math.max(game.actors.get(c.actorId).getRollData().standarddicepools.mental.value, game.actors.get(c.actorId).getRollData().standarddicepools.physical.value) })
    }
});