
document.addEventListener("DOMContentLoaded", function () {

    const loginSection = document.getElementById("login-section");
    const dashboardSection = document.getElementById("dashboard-section");
    const loginForm = document.getElementById("login-form");
    const loginMessage = document.getElementById("login-message");
    const loginButton = document.getElementById("login-button");
    const logoutButton = document.getElementById("logout-button");
    const forgotPasswordButton = document.getElementById("forgot-password-button");

    const bookingList = document.getElementById("booking-list");
    const totalBookings = document.getElementById("total-bookings");
    const emptyMessage = document.getElementById("empty-message");

    function showDashboard() {
        loginSection.style.display = "none";
        dashboardSection.style.display = "block";
    }

    function showLogin() {
        dashboardSection.style.display = "none";
        loginSection.style.display = "block";
    }

    // Forgot password
    forgotPasswordButton.addEventListener("click", async function () {

        const email = document.getElementById("admin-email").value.trim();

        if (!email) {
            loginMessage.textContent = "Please enter your admin email first.";
            return;
        }

        forgotPasswordButton.disabled = true;
        forgotPasswordButton.textContent = "Sending recovery email...";
        loginMessage.textContent = "";

        try {

            const { error } = await supabaseClient.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: window.location.origin + "/reset-password.html"
                }
            );

            if (error) throw error;

            loginMessage.textContent =
                "Password recovery email sent. Check your inbox.";

        } catch (error) {

            console.error("Password recovery error:", error);
            loginMessage.textContent = error.message;

        } finally {

            forgotPasswordButton.disabled = false;
            forgotPasswordButton.textContent = "Forgot Password?";

        }

    });

    // Load reservations
    async function displayBookings() {

        bookingList.innerHTML = "";
        emptyMessage.textContent = "Loading reservations...";

        const { data: reservations, error } = await supabaseClient
            .from("reservations")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Loading error:", error);
            emptyMessage.textContent = "Unable to load reservations.";
            return;
        }

        totalBookings.textContent = reservations.length;

        if (reservations.length === 0) {
            emptyMessage.textContent = "No reservations found.";
            return;
        }

        emptyMessage.textContent = "";

        reservations.forEach(function (booking) {

            const row = document.createElement("tr");

            [
                booking.name,
                booking.email,
                booking.phone,
                booking.reservation_date,
                booking.reservation_time
            ].forEach(function (value) {

                const cell = document.createElement("td");
                cell.textContent = value || "-";
                row.appendChild(cell);

            });

            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-btn";

            deleteButton.addEventListener("click", async function () {

                if (!confirm("Are you sure you want to delete this reservation?")) {
                    return;
                }

                deleteButton.disabled = true;

                const { error } = await supabaseClient
                    .from("reservations")
                    .delete()
                    .eq("id", booking.id);

                if (error) {
                    console.error("Delete error:", error);
                    alert("Unable to delete reservation.");
                    deleteButton.disabled = false;
                    return;
                }

                displayBookings();

            });

            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);
            bookingList.appendChild(row);

        });

    }

    // Admin login
    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("admin-email").value.trim();
        const password = document.getElementById("admin-password").value;

        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";
        loginMessage.textContent = "";

        try {

            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            const { data: admin, error: adminError } = await supabaseClient
                .from("admin_users")
                .select("user_id")
                .eq("user_id", data.user.id)
                .maybeSingle();

            if (adminError || !admin) {

                await supabaseClient.auth.signOut();
                throw new Error("This account does not have admin permission.");

            }

            showDashboard();
            await displayBookings();

        } catch (error) {

            console.error("Login error:", error);
            loginMessage.textContent = error.message || "Login failed.";

        } finally {

            loginButton.disabled = false;
            loginButton.textContent = "Login";

        }

    });

    // Logout
    logoutButton.addEventListener("click", async function () {

        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            alert("Unable to log out. Please try again.");
            return;
        }

        showLogin();
        loginForm.reset();

    });

    // Check existing login session
    async function checkSession() {

        const { data: { session }, error } =
            await supabaseClient.auth.getSession();

        if (error) {
            console.error("Session error:", error);
            showLogin();
            return;
        }

        if (session) {

            const { data: admin, error: adminError } = await supabaseClient
                .from("admin_users")
                .select("user_id")
                .eq("user_id", session.user.id)
                .maybeSingle();

            if (!adminError && admin) {
                showDashboard();
                await displayBookings();
                return;
            }

            await supabaseClient.auth.signOut();

        }

        showLogin();

    }

    checkSession();

});
