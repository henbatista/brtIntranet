export default defineNuxtPlugin((nuxtApp) => {
    const toggleSidebarMinify = () => {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) {
            sidebar.classList.toggle("minify");
        }
    };

    const handleInputChange = (event: Event) => {
        const input = (event.target as HTMLInputElement).value;
        if (input !== "") {
            (event.target as HTMLInputElement).classList.add("txt");
        } else {
            (event.target as HTMLInputElement).classList.remove("txt");
        }
    };

    const handleHasSubClick = (event: Event) => {
        event.preventDefault();
        const target = event.currentTarget as HTMLElement;
        const parent = target.parentNode as HTMLElement;
        const siblings = parent.parentNode
            ?.children as HTMLCollectionOf<HTMLElement>;

        Array.from(siblings).forEach((sibling) => {
            const hasSubLinks = sibling.querySelectorAll("a.has-sub");
            if (hasSubLinks.length > 0) {
                hasSubLinks.forEach((link) => {
                    link.classList.remove("open");
                });
            }
        });

        target.classList.toggle("open");
    };

    const handleItemMenuClick = (event: Event) => {
        event.preventDefault();
        const target = event.currentTarget as HTMLElement;
        const parent = target.parentNode as HTMLElement;
        const siblings = parent.parentNode
            ?.children as HTMLCollectionOf<HTMLElement>;

        Array.from(siblings).forEach((sibling) => {
            const hasSubLinks = sibling.querySelectorAll("a.has-sub");
            if (hasSubLinks.length > 0) {
                hasSubLinks.forEach((link) => {
                    link.classList.remove("open");
                });
            }
        });

        target.classList.toggle("open");
    };

    const handleTabButtonClick = (event: Event) => {
        event.preventDefault();
        const target = event.currentTarget as HTMLElement;
        const parent = target.parentElement;
        const href = target.getAttribute("href");

        if (parent) {
            target.classList.remove("outline");
            Array.from(parent.children).forEach((sibling) => {
                if (sibling !== target) {
                    sibling.classList.add("outline");
                }
            });
        }

        const tabs = document.querySelectorAll(".tabs .wrap-tab .single-tab");
        tabs.forEach((tab) => {
            tab.classList.remove("active");
        });
        const targetTab = document.querySelector(
            `.tabs .wrap-tab .single-tab${href}`
        );
        if (targetTab) {
            targetTab.classList.add("active");
        }
    };

    const handleAccordionClick = (event: Event) => {
        event.preventDefault();
        const accordions = document.querySelectorAll(
            ".accordeon .single-accord"
        );
        accordions.forEach((accordion) => {
            accordion.classList.remove("active");
        });

        const clickedAccordion = (event.currentTarget as HTMLElement)
            .parentNode as HTMLElement;
        if (clickedAccordion) {
            clickedAccordion.classList.add("active");
        }
    };

    const handleImageClick = (event: Event) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const imageParent = target.parentNode;
        if (imageParent instanceof HTMLElement) {
            imageParent.classList.toggle("active");
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        const actns = document.querySelector(".block-sm .ttl .actns");
        if (actns && !actns.contains(event.target as Node)) {
            actns.classList.remove("active");
        }
    };

    nuxtApp.vueApp.mixin({
        mounted() {
            const sidebarButton = document.querySelector(
                ".sidebar header button.close"
            );
            if (sidebarButton) {
                sidebarButton.addEventListener("click", toggleSidebarMinify);
            }

            const inputs = document.querySelectorAll(".wrap-input input");
            inputs.forEach((input) => {
                input.addEventListener("change", handleInputChange);
            });

            const hasSubElements = document.querySelectorAll(
                ".sidebar aside nav ul li .has-sub"
            );
            hasSubElements.forEach((element) => {
                element.addEventListener("click", handleHasSubClick);
            });

            const isMenu = document.querySelectorAll(
                ".sidebar aside nav ul li .is-menu"
            );
            isMenu.forEach((element) => {
                element.addEventListener("click", handleItemMenuClick);
            });

            const tabButtons = document.querySelectorAll(".tabs .btns .btn");
            tabButtons.forEach((button) => {
                button.addEventListener("click", handleTabButtonClick);
            });

            const accordionHeaders = document.querySelectorAll(
                ".accordeon .single-accord .head-accord"
            );
            accordionHeaders.forEach((header) => {
                header.addEventListener("click", handleAccordionClick);
            });

            const imageElements = document.querySelectorAll(
                ".block-sm .ttl .actns img"
            );
            imageElements.forEach((imageElement) => {
                imageElement.addEventListener("click", handleImageClick);
            });

            document.addEventListener("mouseup", handleClickOutside);
        },
        beforeUnmount() {
            const sidebarButton = document.querySelector(
                ".sidebar header button.close"
            );
            if (sidebarButton) {
                sidebarButton.removeEventListener("click", toggleSidebarMinify);
            }

            const inputs = document.querySelectorAll(".wrap-input input");
            inputs.forEach((input) => {
                input.removeEventListener("change", handleInputChange);
            });

            const hasSubElements = document.querySelectorAll(
                ".sidebar aside nav ul li .has-sub"
            );
            hasSubElements.forEach((element) => {
                element.removeEventListener("click", handleHasSubClick);
            });

            const isMenu = document.querySelectorAll(
                ".sidebar aside nav ul li .is-menu"
            );
            isMenu.forEach((element) => {
                element.removeEventListener("click", handleItemMenuClick);
            });

            const tabButtons = document.querySelectorAll(".tabs .btns .btn");
            tabButtons.forEach((button) => {
                button.removeEventListener("click", handleTabButtonClick);
            });

            const accordionHeaders = document.querySelectorAll(
                ".accordeon .single-accord .head-accord"
            );
            accordionHeaders.forEach((header) => {
                header.removeEventListener("click", handleAccordionClick);
            });

            const imageElements = document.querySelectorAll(
                ".block-sm .ttl .actns img"
            );
            imageElements.forEach((imageElement) => {
                imageElement.removeEventListener("click", handleImageClick);
            });

            document.removeEventListener("mouseup", handleClickOutside);
        },
    });
});
