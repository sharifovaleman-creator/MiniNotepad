
const SUPABASE_URL = "https://jcnaowojeuqufmymapzu.supabase.co";
const SUPABASE_KEY = "sb_publishable_Xa0ysJ29T-ndbqB2FkRUpA_XxW-QvMc";


const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const loginPage = document.getElementById("loginPage");
const notesPage = document.getElementById("notesPage");

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const startBtn = document.getElementById("startBtn");
const saveBtn = document.getElementById("saveBtn");

const noteText = document.getElementById("noteText");
const welcomeText = document.getElementById("welcomeText");
const status = document.getElementById("status");

let savedName = "";
let savedEmail = "";

// Login
startBtn.addEventListener("click", function() {

    let name = userName.value.trim();
    let email = userEmail.value.trim();

    if (name === "" || email === "") {
        alert("Please fill in all fields!");
        return;
    }

    if (!email.endsWith("@gmail.com")) {
        alert("Please enter a valid Gmail!");
        return;
    }

    savedName = name;
    savedEmail = email;

    showNotes();
});

// Load shared note
async function loadNote() {

    const { data, error } = await db
        .from("shared_notes")
        .select("content")
        .eq("id", 1)
        .maybeSingle();

    if (error) {
        status.textContent = "Loading error: " + error.message;
        console.log(error);
        return;
    }

    noteText.value = data ? data.content : "";
    status.textContent = "Ready!";
}

// Show notes
async function showNotes() {

    loginPage.style.display = "none";
    notesPage.style.display = "block";

    welcomeText.textContent = "Welcome, " + savedName + "!";

    status.textContent = "Loading...";

    await loadNote();

    // Check for changes every 3 seconds
    setInterval(async function() {

        if (document.activeElement !== noteText) {
            await loadNote();
        }

    }, 3000);
}

// Save shared note
saveBtn.addEventListener("click", async function() {

    status.textContent = "Saving...";

    const { error } = await db
        .from("shared_notes")
        .upsert({
            id: 1,
            user_name: savedName,
            content: noteText.value
        }, {
            onConflict: "id"
        });

    if (error) {
        status.textContent = "Error: " + error.message;
        console.log(error);
        return;
    }

    status.textContent = "Note saved successfully!";
});
