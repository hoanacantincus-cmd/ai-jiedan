/*
  只做四件事：手机端菜单、加微信卡片（复制微信号 / 显示二维码）、
  手机端底部悬浮按钮、页脚年份。不加载任何第三方脚本，不上传任何数据。

  上线前只需改下面 CONTACT 里的三项：
    wechat  —— 你的微信号（留空则不显示「复制微信号」按钮）
    qrImage —— 微信二维码图片路径（把图放到 assets/wechat-qr.png；没有这张图会自动隐藏二维码按钮）
    douyin  —— 抖音号（留空则不显示「也可以在抖音私信我」这一行）
*/

(function () {
  "use strict";

  var CONTACT = {
    wechat: "15527138700",
    qrImage: "assets/wechat-qr.png",
    douyin: "AI不可言（抖音号 58069761911）",
    remark: "抖音"
  };

  var $ = function (sel) {
    return document.querySelector(sel);
  };

  /* ---------- 提示条 ---------- */

  var toast = $("#toast");
  var toastTimer = 0;

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-on");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-on");
      toast.textContent = "";
    }, 2600);
  }

  /* ---------- 手机端菜单 ---------- */

  var menuBtn = $(".menu");
  var nav = $("#nav");

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (!open && nav.contains(document.activeElement)) {
      menuBtn.focus({ preventScroll: true });
    }
  }

  if (menuBtn && nav) {
    menuBtn.setAttribute("aria-label", "打开菜单");

    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target) && !menuBtn.contains(event.target)) {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1000) setMenu(false);
    });
  }

  /* ---------- 加微信卡片 ---------- */

  var wxId = $("#wx-id");
  var copyBtn = $("#wx-copy");
  var howto = $("#wx-howto");
  var qrBtn = $("#qr-toggle");
  var qrPanel = $("#qr-panel");
  var qrImg = $("#qr-img");
  var dyLine = $("#dy-line");
  var dyId = $("#dy-id");

  var wechat = (CONTACT.wechat || "").trim();
  var douyin = (CONTACT.douyin || "").trim();
  var qrReady = false;

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.fontSize = "16px";
      document.body.appendChild(area);
      area.focus();
      area.select();
      area.setSelectionRange(0, text.length);
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      document.body.removeChild(area);
      ok ? resolve() : reject(new Error("copy failed"));
    });
  }

  function revealWechat() {
    if (!wxId) return;
    wxId.textContent = wechat;
    wxId.classList.add("is-shown");
  }

  if (copyBtn) {
    if (!wechat) {
      copyBtn.hidden = true;
      if (howto) howto.hidden = true;
    } else {
      if (howto) howto.hidden = false;
      copyBtn.addEventListener("click", function () {
        revealWechat();
        copyText(wechat).then(
          function () {
            showToast("已复制微信号，加好友时备注“" + CONTACT.remark + "”");
          },
          function () {
            showToast("复制没成功，请手动输入上面的微信号");
          }
        );
      });
    }
  }

  function setQr(open) {
    if (!qrBtn || !qrPanel) return;
    qrPanel.hidden = !open;
    qrBtn.setAttribute("aria-expanded", String(open));
    qrBtn.textContent = open ? "收起二维码" : "显示二维码";
    if (open && wxId && wechat) revealWechat();
  }

  if (qrBtn && qrPanel && qrImg) {
    var probe = new Image();
    qrBtn.disabled = true;
    probe.onload = function () {
      qrReady = true;
      qrImg.src = CONTACT.qrImage;
      qrBtn.disabled = false;
      if (!wechat && wxId) {
        wxId.textContent = "扫下面的二维码添加";
      }
    };
    probe.onerror = function () {
      qrReady = false;
      qrBtn.hidden = true;
      qrPanel.hidden = true;
      if (!wechat && wxId) {
        wxId.textContent = "微信号稍后补上，先从抖音私信我";
      }
    };
    probe.src = CONTACT.qrImage;

    qrBtn.addEventListener("click", function () {
      if (!qrReady) return;
      setQr(qrPanel.hidden);
    });
  }

  if (dyLine && dyId) {
    if (douyin) {
      dyId.textContent = douyin;
      dyLine.hidden = false;
    } else {
      dyLine.hidden = true;
    }
  }

  /* ---------- 转发这一页 ---------- */

  var shareBtn = $("#share");

  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      var url = location.origin + location.pathname;
      var inWeChat = /MicroMessenger/i.test(navigator.userAgent);

      if (inWeChat) {
        showToast("点右上角“···”，发给朋友或分享到朋友圈");
        return;
      }
      if (navigator.share) {
        navigator
          .share({ title: document.title, text: "我在淘宝的派单群里接单，用 AI 做。一单八步讲清楚。", url: url })
          .catch(function () {});
        return;
      }
      copyText(url).then(
        function () {
          showToast("链接已复制，发给朋友吧");
        },
        function () {
          showToast(url);
        }
      );
    });
  }

  /* ---------- 手机端底部悬浮按钮 ---------- */

  var sticky = $("#sticky");
  var hero = $("#hero");
  var contact = $("#contact");

  if (sticky && hero && contact && "IntersectionObserver" in window) {
    var heroVisible = true;
    var contactVisible = false;

    function updateSticky() {
      var show = !heroVisible && !contactVisible;
      sticky.hidden = !show;
      document.body.classList.toggle("has-sticky", show);
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.target === hero) heroVisible = entry.isIntersecting;
          if (entry.target === contact) contactVisible = entry.isIntersecting;
        });
        updateSticky();
      },
      { threshold: 0.05 }
    );

    io.observe(hero);
    io.observe(contact);
  }

  /* ---------- 页脚年份 ---------- */

  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
