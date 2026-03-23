async function sortJournal(uuid) {
    const journalEntry = await fromUuid(uuid)

    function compareJournalEntryPages(a, b) {
        return a.name.localeCompare(b.name)
    }

    const sortedPages = journalEntry.pages.contents
        .toSorted(compareJournalEntryPages)
        .map((page, index) => ({
            _id: page.id,
            sort: 100000 * (index + 1) // Foundry uses 'sort' integers to determine order
        }));

    await journalEntry.updateEmbeddedDocuments("JournalEntryPage", sortedPages);
    ui.notifications.info(`Sorted ${sortedPages.length} pages in "${journalEntry.name}".`);
}

// prepare HTML for the dialog
let dialogContent = `<label for="uuid">Paste a UUID:</label>

<input
type="text"
id="uuid"
name="uuid"
/>`

const response = await foundry.applications.api.DialogV2.wait({
    window: { title: "Sort Journal Entry" },
    content: dialogContent,
    buttons: [{
        action: "sort",
        label: "Sort Journal Entry",
        default: true,
        callback: (event, button, dialog) => new foundry.applications.ux.FormDataExtended(button.form).object // makes available the named (name) html elements
    }]
});
console.log({ response: response });

sortJournal(response.uuid)

//journalEntry.pages.contents.name

//JournalEntryPage.sort

//map(callbackFn, thisArg)