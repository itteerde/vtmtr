// Get the combatant currently being hovered over in the sidebar
const hoveredCombatantId = document.querySelector('.combatant.hover')?.dataset.combatantId;

if (!hoveredCombatantId) {
    ui.notifications.warn("Please hover your mouse over a combatant in the Combat Tracker first!");
} else {
    // Locate the combatant in the active combat
    const combatant = game.combat.combatants.get(hoveredCombatantId);

    // Calculate new initiative (handling nulls as 0)
    const currentInit = combatant.initiative || 0;
    const newInit = currentInit - 10;

    // Update the initiative
    await combatant.update({ initiative: newInit });

    ui.notifications.info(`Increased ${combatant.name}'s initiative to ${newInit}.`);
}