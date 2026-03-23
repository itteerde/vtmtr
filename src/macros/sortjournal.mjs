const uuid = 'JournalEntry.CZdNjdUM8GScvoGW'

async function sortJournal(uuid) {
    let JournalEntry = await fromUuid(uuid)
    function compareJournalEntryPages(a, b) {
        return a.name - b.name;
    }
    journalEntry.pages.contents.sort(compareJournalEntryPages)
}

//journalEntry.pages.contents.name

//JournalEntryPage 
