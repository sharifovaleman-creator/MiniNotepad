
const SUPABASE_URL = "https://jcnaowojeuqufmymapzu.supabase.co";
const SUPABASE_KEY = "sb_publishable_Xa0ysJ29T-ndbqB2FkRUpA_XxW-QvMc";
alert("URL: " + SUPABASE_URL);
alert("Key: " + SUPABASE_KEY.substring(0, 10));
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

// Check saved user
let savedName = "";
let savedEmail = "";
if (savedName && savedEmail) {
    showNotes();
}

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

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    savedName = name;
    savedEmail = email;

    showNotes();
});

// Show notes
async function showNotes() {

    loginPage.style.display = "none";
    notesPage.style.display = "block";

    welcomeText.textContent = "Welcome, " + savedName + "!";

    status.textContent = "Loading note...";

    const { data, error } = await db
        .from("notes")
        .select("content")
        .eq("user_email", savedEmail)
        .maybeSingle();

    if (error) {
        status.textContent = "Error loading note!";
        console.log(error);
        return;
    }

    noteText.value = data ? data.content : "";

    status.textContent = "Ready!";
}

// Save note
saveBtn.addEventListener("click", async function() {

    status.textContent = "Saving...";

    const { error } = await db
        .from("notes")
        .upsert({
            user_email: savedEmail,
            user_name: savedName,
            content: noteText.value
        }, {
            onConflict: "user_email"
        });

    if (error) {
    status.textContent = error.message;
    alert(JSON.stringify(error));
    console.log(error);
    return;
}

    status.textContent = "Note saved successfully!";
});


