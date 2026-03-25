const dialogContent = `
<div class="standard-form">
    <div class="form-group">
        <label>Drop Item or Actor Link Here:</label>
        <div class="form-fields">
            <input type="text" name="targetField" id="drop-target-input" placeholder="Drag something here...">
        </div>
    </div>
</div>`

const dialog = new foundry.applications.api.DialogV2({
    window: { title: "Data Dropper" },
    content: dialogContent,
    buttons: [{
        action: "ok",
        label: "Confirm",
        default: true,
        callback: (event, button, html) => {
            const val = button.form.elements.targetField.value;
            console.log("Submitted value:", val);
        }
    }]
});

await dialog.render(true);

const input = document.querySelector("#drop-target-input");

input.addEventListener("drop", async (ev) => {
    ev.preventDefault();

    console.log(ev);

    try {
        // Parse the dropped JSON data
        const data = JSON.parse(ev.dataTransfer.getData("text/plain"));

        // If it's a Document (Item, Actor, etc.), get its UUID
        if (data.uuid) {
            input.value = data.uuid;
        } else {
            // Fallback for raw text
            input.value = ev.dataTransfer.getData("text/plain");
        }
    } catch (err) {
        console.error("Drop failed", err);
    }
});

// 'dragover' must be prevented for the drop event to fire
input.addEventListener("dragover", (ev) => ev.preventDefault());
