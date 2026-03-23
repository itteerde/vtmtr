const uuid = 'JournalEntry.CZdNjdUM8GScvoGW'

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
    ui.notifications.info(`Sorted ${sortedPages.length} pages in "${journal.name}".`);
}

sortJournal(uuid)

//journalEntry.pages.contents.name

//JournalEntryPage.sort

//map(callbackFn, thisArg)