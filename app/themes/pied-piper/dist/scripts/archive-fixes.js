(function () {
  // The mirrored site no longer ships Adobe analytics, but the inline pages
  // still expect these globals to exist.
  if (typeof window.s_gi !== "function") {
    window.s_gi = function () {
      return {
        t: function () {
          return "";
        },
      };
    };
  }

  if (!window.s) {
    window.s = window.s_gi("");
  }

  function setActiveByClass(container, selector, activeClassName) {
    var nodes = container.querySelectorAll(selector);
    nodes.forEach(function (node) {
      node.classList.toggle("is-active", node.classList.contains(activeClassName));
    });
  }

  function activateSection(section, target) {
    var targetClass = "content" + target;
    section.setAttribute("current-tab", target);

    section.querySelectorAll(".tabs .tab").forEach(function (tab) {
      tab.classList.toggle("is-active", tab.getAttribute("target-content") === target);
    });

    setActiveByClass(section, ".tab-content > div", targetClass);
    setActiveByClass(section, ".pip-contents > div", targetClass);

    section.querySelectorAll(".pips .pip").forEach(function (pip) {
      pip.classList.toggle("is-active", pip.getAttribute("target-pip") === target);
    });
  }

  function setupTabs() {
    document.querySelectorAll(".section13, .section9").forEach(function (section) {
      var initial = section.getAttribute("current-tab") || "1";
      activateSection(section, initial);

      section.querySelectorAll(".tabs .tab").forEach(function (tab) {
        tab.addEventListener("click", function () {
          activateSection(section, tab.getAttribute("target-content"));
        });
      });

      section.querySelectorAll(".pips .pip").forEach(function (pip) {
        pip.addEventListener("click", function () {
          var target = pip.getAttribute("target-pip");
          section.setAttribute("current-pip", target);
          setActiveByClass(section, ".pip-contents > div", "content" + target);
          section.querySelectorAll(".pips .pip").forEach(function (item) {
            item.classList.toggle("is-active", item === pip);
          });
        });
      });
    });
  }

  function setupSmoothScroll() {
    function isStandaloneSection(targetId) {
      return targetId === "faq" || targetId === "decentralization-guide";
    }

    function applyHashPageState() {
      var hash = (window.location.hash || "").replace(/^#/, "");

      if (hash === "faq" || hash === "decentralization-guide") {
        document.body.setAttribute("current-page", hash);
        window.scrollTo(0, 0);
        return;
      }

      document.body.removeAttribute("current-page");
    }

    window.smoothScroll = function (targetId) {
      var target = document.getElementById(targetId);
      if (!target) {
        return false;
      }

      if (isStandaloneSection(targetId)) {
        if (window.location.hash === "#" + targetId) {
          applyHashPageState();
        } else {
          window.location.hash = targetId;
        }
        return false;
      }

      if (document.body.hasAttribute("current-page")) {
        document.body.removeAttribute("current-page");
      }
      if (window.location.hash === "#faq" || window.location.hash === "#decentralization-guide") {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }

      window.setTimeout(function () {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
      return false;
    };

    window.removeNavModal = function () {
      document.body.classList.remove("modal-open");
      return false;
    };

    document.querySelectorAll("a[onclick*=\"smoothScroll\"]").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var handler = link.getAttribute("onclick") || "";
        var match = handler.match(/smoothScroll\('([^']+)'\)/);
        if (!match) {
          return;
        }

        if (window.removeNavModal) {
          window.removeNavModal();
        }
        event.preventDefault();
        window.smoothScroll(match[1]);
      });
    });

    window.addEventListener("hashchange", applyHashPageState);
    applyHashPageState();
  }

  function setupBackToTop() {
    var button = document.querySelector(".back-top");
    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setupDecentralizationGuide() {
    var slideshow = document.getElementById("decentralization-slideshow");
    if (!slideshow) {
      return;
    }

    function setProblem(problemId) {
      slideshow.setAttribute("problem", problemId);
      slideshow.querySelectorAll(".slides-wrapper").forEach(function (wrapper) {
        wrapper.style.display = wrapper.classList.contains("problem" + problemId)
          ? "block"
          : "none";
      });
    }

    function openProblem(problemId) {
      setProblem(problemId);
      slideshow.style.display = "";
      document.body.classList.add("slideshow-active");
    }

    function closeProblem() {
      document.body.classList.remove("slideshow-active");
    }

    slideshow.style.display = "";
    setProblem(slideshow.getAttribute("problem") || "1");

    document.querySelectorAll(".slideshow-init-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        openProblem(button.getAttribute("target-problem") || "1");
      });
    });

    var closeButton = slideshow.querySelector(".close-icon");
    if (closeButton) {
      closeButton.addEventListener("click", closeProblem);
    }

    slideshow.addEventListener("click", function (event) {
      if (event.target === slideshow) {
        closeProblem();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupTabs();
    setupSmoothScroll();
    setupBackToTop();
    setupDecentralizationGuide();
  });
})();
