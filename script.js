window.addEventListener("DOMContentLoaded", function () {
    const btnClose = document.getElementById("closeModalBtn");
    const btnOpen = document.getElementById("openModalBtn");
    const btnSubmit = document.getElementById("submitBtn");
    const endpoint = "https://formcarry.com/s/DLS_B-sFwxi";
    const fieldConsent = document.getElementById("consent");
    const fieldEmail = document.getElementById("email");
    const fieldMessage = document.getElementById("message");
    const fieldName = document.getElementById("fullname");
    const fieldOrg = document.getElementById("organization");
    const fieldPhone = document.getElementById("phone");
    const form = document.getElementById("feedbackForm");
    const inputs = document.querySelectorAll(
        "#feedbackForm input, #feedbackForm textarea"
    );
    const modal = document.getElementById("feedbackModal");
    const statusBox = document.getElementById("formStatus");

    function clearStatus() {
        statusBox.textContent = "";
        statusBox.className = "form-status";
    }

    function clearStorage() {
        window.localStorage.removeItem("fb_consent");
        window.localStorage.removeItem("fb_email");
        window.localStorage.removeItem("fb_fullname");
        window.localStorage.removeItem("fb_message");
        window.localStorage.removeItem("fb_organization");
        window.localStorage.removeItem("fb_phone");
        form.reset();
    }

    function hideModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        clearStatus();
    }

    function loadStorage() {
        const savedConsent = window.localStorage.getItem("fb_consent");
        fieldConsent.checked = savedConsent === "true";
        fieldEmail.value = window.localStorage.getItem("fb_email") || "";
        fieldMessage.value = window.localStorage.getItem("fb_message") || "";
        fieldName.value = window.localStorage.getItem("fb_fullname") || "";
        fieldOrg.value = window.localStorage.getItem("fb_organization") || "";
        fieldPhone.value = window.localStorage.getItem("fb_phone") || "";
    }

    function openModal() {
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        clearStatus();
        if (window.location.hash !== "#feedback") {
            window.history.pushState({modal: true}, "", "#feedback");
        }
    }

    function saveStorage() {
        window.localStorage.setItem(
            "fb_consent",
            String(fieldConsent.checked)
        );
        window.localStorage.setItem("fb_email", fieldEmail.value);
        window.localStorage.setItem("fb_fullname", fieldName.value);
        window.localStorage.setItem("fb_message", fieldMessage.value);
        window.localStorage.setItem("fb_organization", fieldOrg.value);
        window.localStorage.setItem("fb_phone", fieldPhone.value);
    }

    function showStatus(isSuccess, message) {
        statusBox.textContent = message;
        if (isSuccess) {
            statusBox.className = "form-status is-success";
        } else {
            statusBox.className = "form-status is-error";
        }
    }

    function submitForm(event) {
        const options = {
            body: JSON.stringify({
                consent: fieldConsent.checked,
                email: fieldEmail.value,
                fullname: fieldName.value,
                message: fieldMessage.value,
                organization: fieldOrg.value,
                phone: fieldPhone.value
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST"
        };
        event.preventDefault();
        btnSubmit.disabled = true;
        showStatus(true, "Отправка данных...");
        window.fetch(endpoint, options).then(function (response) {
            if (!response.ok) {
                throw new Error("Ошибка сервера: " + response.status);
            }
            return response.json();
        }).then(function () {
            clearStorage();
            showStatus(true, "Ваше сообщение успешно отправлено!");
        }).catch(function () {
            showStatus(
                false,
                "Ошибка при отправке. Проверьте подключение к интернету."
            );
        }).finally(function () {
            btnSubmit.disabled = false;
        });
    }

    btnOpen.addEventListener("click", function () {
        openModal();
    });

    btnClose.addEventListener("click", function () {
        if (window.location.hash === "#feedback") {
            window.history.back();
        } else {
            hideModal();
        }
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            if (window.location.hash === "#feedback") {
                window.history.back();
            } else {
                hideModal();
            }
        }
    });

    window.addEventListener("popstate", function () {
        if (window.location.hash === "#feedback") {
            openModal();
        } else {
            hideModal();
        }
    });

    inputs.forEach(function (input) {
        input.addEventListener("input", saveStorage);
        input.addEventListener("change", saveStorage);
    });

    form.addEventListener("submit", submitForm);

    loadStorage();
    if (window.location.hash === "#feedback") {
        openModal();
    }
});
