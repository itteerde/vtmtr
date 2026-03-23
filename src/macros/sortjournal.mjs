const uuid = 'JournalEntry.CZdNjdUM8GScvoGW'

async function sortJournal(uuid) {
    let journalEntry = await fromUuid(uuid)
    function compareJournalEntryPages(a, b) {
        return a.name.localeCompare(b.name);
        map((journalEntry, index) => )
    }
    //journalEntry.pages.contents.toSorted(compareJournalEntryPages)
    console.log(journalEntry.pages.contents.toSorted(compareJournalEntryPages))
}

sortJournal(uuid)

//journalEntry.pages.contents.name

//JournalEntryPage.sort

//map(callbackFn, thisArg)