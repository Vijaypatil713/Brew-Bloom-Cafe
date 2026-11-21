
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. MENU ITEMS
    // =====================================

    const menuItems = [
        {
            name: "Cappuccino",
            category: "coffee",
            price: 120,
            description: "Rich espresso with smooth steamed milk.",
            image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600"
        },
        {
            name: "Caramel Latte",
            category: "coffee",
            price: 150,
            description: "Creamy latte with sweet caramel flavour.",
            image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600"
        },
        {
            name: "Cold Coffee",
            category: "coffee",
            price: 140,
            description: "Refreshing chilled coffee with creamy foam.",
            image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600"
        },
        {
            name: "Classic Burger",
            category: "food",
            price: 180,
            description: "Juicy burger with fresh vegetables and sauce.",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
        },
        {
            name: "Margherita Pizza",
            category: "food",
            price: 220,
            description: "Delicious pizza topped with cheese and herbs.",
            image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600"
        },
        {
            name: "Pasta",
            category: "food",
            price: 190,
            description: "Creamy pasta with herbs and fresh ingredients.",
            image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600"
        },
        {
            name: "Chocolate Cake",
            category: "desserts",
            price: 130,
            description: "Soft chocolate cake with rich chocolate layers.",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
        },
        {
            name: "Strawberry Cheesecake",
            category: "desserts",
            price: 160,
            description: "Creamy cheesecake topped with strawberries.",
            image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600"
        },
        {
            name: "Ice Cream",
            category: "desserts",
            price: 100,
            description: "Delicious and refreshing scoops of ice cream.",
            image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600"
        }
    ];

    const menuContainer = document.getElementById("menu-container");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // =====================================
    // 2. DISPLAY MENU ITEMS
    // =====================================

    function displayMenuItems(items) {

        if (!menuContainer) {
            console.error("Menu container not found!");
            return;
        }

        menuContainer.innerHTML = "";

        if (items.length === 0) {
            menuContainer.innerHTML = "<p>No menu items found.</p>";
            return;
        }

        items.forEach(function (item) {

            const card = document.createElement("div");
            card.className = "menu-card";

            const image = document.createElement("img");
            image.src = item.image;
            image.alt = item.name;
            image.loading = "lazy";
            image.className = "menu-image";

            image.onerror = function () {
                this.style.display = "none";
            };

            const details = document.createElement("div");
            details.className = "menu-details";

            const heading = document.createElement("h3");
            heading.textContent = item.name;

            const description = document.createElement("p");
            description.textContent = item.description;

            const price = document.createElement("h4");
            price.textContent = "₹" + item.price;

            details.appendChild(heading);
            details.appendChild(description);
            details.appendChild(price);

            card.appendChild(image);
            card.appendChild(details);

            menuContainer.appendChild(card);

        });
    }

    // Show all items when website loads
    displayMenuItems(menuItems);

    
    // =====================================
    // 3. CATEGORY FILTERS - FIXED
    // =====================================

    function normalizeCategory(category) {

        category = (category || "").trim().toLowerCase();

        if (
            category === "desert" ||
            category === "dessert" ||
            category === "desserts"
        ) {
            return "desserts";
        }

        return category;
    }

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const category = normalizeCategory(
                button.getAttribute("data-category")
            );

            filterButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filteredItems = category === "all"
                ? menuItems
                : menuItems.filter(function (item) {
                    return normalizeCategory(item.category) === category;
                });

            console.log("Selected category:", category);
            console.log("Found menu items:", filteredItems.length);

            displayMenuItems(filteredItems);

        });

    });

   
    // =====================================
    // 4. RESERVATION FORM - SUPABASE
    // =====================================

    const reservationForm = document.getElementById("reservation-form");
    const formMessage = document.getElementById("form-message");
    const bookingDateInput = document.getElementById("date");

    function getTodayString() {
        const today = new Date();

        return [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")
        ].join("-");
    }

    if (reservationForm && formMessage && bookingDateInput) {

        bookingDateInput.min = getTodayString();

        reservationForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const date = bookingDateInput.value;
            const time = document.getElementById("time").value;
            const message = document.getElementById("message").value.trim();

            if (name.length < 3) {
                formMessage.textContent = "Please enter a valid name.";
                return;
            }

            if (!/^[0-9]{10}$/.test(phone)) {
                formMessage.textContent = "Please enter a valid 10-digit phone number.";
                return;
            }

            if (!date || date < getTodayString()) {
                formMessage.textContent = "Please select a valid future date.";
                return;
            }

            if (!time) {
                formMessage.textContent = "Please select a reservation time.";
                return;
            }

            const submitButton = reservationForm.querySelector(
                'button[type="submit"]'
            );

            submitButton.disabled = true;
            submitButton.textContent = "Booking...";

            try {

                const { error } = await supabaseClient
                    .from("reservations")
                    .insert([{
                        name: name,
                        email: email,
                        phone: phone,
                        reservation_date: date,
                        reservation_time: time,
                        message: message
                    }]);

                if (error) {
                    throw error;
                }

                formMessage.textContent =
                    "✓ Thank you, " + name +
                    "! Your reservation has been saved successfully.";

                reservationForm.reset();
                bookingDateInput.min = getTodayString();

            } catch (error) {

                console.error("Supabase reservation error:", error);

                formMessage.textContent =
                    "Unable to save your reservation. Please try again.";

            } finally {

                submitButton.disabled = false;
                submitButton.textContent = "Book My Table";

            }

        });
    }


    // =====================================
    // 5. MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("show");

            menuToggle.textContent = isOpen ? "✕" : "☰";

            menuToggle.setAttribute("aria-expanded", String(isOpen));

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("show");

                menuToggle.textContent = "☰";

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            });

        });

    }

});
