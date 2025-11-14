// チェックボックスのバリデーション
const form = document.getElementById("form");
const ownershipCheckbox = document.getElementById("ownershipCheckbox");
const checkboxError = document.getElementById("checkboxError");
const submitButton = document.getElementById("submitButton");
const submitModal = document.getElementById("submitModal");
let submitted = false;

// エラーメッセージを削除する関数
function removeErrorMessages() {
  const errorMessages = document.querySelectorAll(".validation-error");
  errorMessages.forEach((msg) => msg.remove());
}

// エラーメッセージを表示する関数
function showError(element, message) {
  // 既存のエラーメッセージがあれば削除
  const existingError =
    element.parentElement.querySelector(".validation-error");
  if (existingError) {
    existingError.remove();
  }

  // 新しいエラーメッセージを作成
  const errorDiv = document.createElement("p");
  errorDiv.className =
    "validation-error rounded font-sans text-[0.8rem] bg-[#4fac00] text-white p-1 mt-2";
  errorDiv.textContent = message;

  // ラジオボタンの場合は最後のラジオボタンの後に挿入
  if (element.type === "radio") {
    const radioGroup = document.querySelectorAll(
      `input[name="${element.name}"]`
    );
    const lastRadio = radioGroup[radioGroup.length - 1];
    lastRadio.parentElement.insertAdjacentElement("afterend", errorDiv);
  } else {
    element.insertAdjacentElement("afterend", errorDiv);
  }
}

// フォームバリデーション関数
function validateForm() {
  removeErrorMessages();
  let firstError = null;

  // 必須項目をチェック
  const requiredFields = [
    {
      name: "entry.1270370392",
      type: "radio",
      label: "現在の使用の電気代",
    },
    {
      name: "entry.1125463034",
      type: "radio",
      label: "現在の使用のガス代",
    },
    {
      name: "entry.2070243229",
      type: "radio",
      label: "太陽光発電の有無",
    },
    {
      name: "entry.199924570",
      type: "radio",
      label: "現在のご状況",
    },
    {
      name: "entry.859663624",
      type: "text",
      label: "郵便番号",
    },
    {
      name: "entry.1085288309",
      type: "text",
      label: "都道府県",
    },
    {
      name: "entry.383309495",
      type: "text",
      label: "市区町村",
    },
    {
      name: "entry.932629529",
      type: "text",
      label: "番地",
    },
    {
      name: "entry.214735403",
      type: "text",
      label: "お名前",
    },
    {
      name: "entry.1391697315",
      type: "text",
      label: "携帯番号",
    },
    {
      name: "entry.189612708",
      type: "text",
      label: "メールアドレス",
    },
  ];

  requiredFields.forEach((field) => {
    if (field.type === "radio") {
      const radioGroup = document.querySelectorAll(
        `input[name="${field.name}"]`
      );
      const isChecked = Array.from(radioGroup).some(
        (radio) => radio.checked
      );

      if (!isChecked && radioGroup.length > 0) {
        showError(radioGroup[0], `※${field.label}を選択してください`);
        if (!firstError) firstError = radioGroup[0];
      }
    } else if (field.type === "text") {
      const input = document.querySelector(`input[name="${field.name}"]`);
      if (input && input.value.trim() === "") {
        showError(input, `※${field.label}を入力してください`);
        if (!firstError) firstError = input;
      }
    }
  });

  // チェックボックスのバリデーション
  if (!ownershipCheckbox.checked) {
    checkboxError.classList.remove("hidden");
    if (!firstError) firstError = ownershipCheckbox;
  }

  // 最初のエラー箇所にスクロール
  if (firstError) {
    firstError.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    return false;
  }

  return true;
}

// フォーム送信時のバリデーション
form.addEventListener("submit", function (event) {
  if (!validateForm()) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  // フォーム送信が正常に行われる場合
  submitted = true;
});

// 送信ボタンのクリック時にもバリデーション
submitButton.addEventListener("click", function (event) {
  if (!validateForm()) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

// チェックボックスがチェックされたらエラーメッセージを非表示
ownershipCheckbox.addEventListener("change", function () {
  if (ownershipCheckbox.checked) {
    checkboxError.classList.add("hidden");
  }
});

// 入力フィールドが変更されたらエラーメッセージを削除
form.addEventListener("input", function (event) {
  const target = event.target;
  if (target.tagName === "INPUT") {
    const errorMsg =
      target.parentElement.querySelector(".validation-error");
    if (errorMsg) {
      errorMsg.remove();
    }

    // ラジオボタンの場合は同じグループのエラーも削除
    if (target.type === "radio") {
      const radioGroup = document.querySelectorAll(
        `input[name="${target.name}"]`
      );
      radioGroup.forEach((radio) => {
        const error =
          radio.parentElement.parentElement.querySelector(
            ".validation-error"
          );
        if (error) {
          error.remove();
        }
      });
    }
  }
});

// iframeのロード完了を検知してモーダルを表示
const iframe = document.getElementById("hidden_iframe");
iframe.addEventListener("load", function () {
  if (submitted) {
    // モーダルを表示
    submitModal.style.display = "flex";
    // フォームをリセット
    form.reset();
    submitted = false;
  }
});

// ヘッダーのスクロール追従制御
let lastScrollTop = 0;
const header = document.getElementById("header");
const scrollThreshold = 10; // スクロールの閾値

window.addEventListener(
  "scroll",
  function () {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    // スクロール量が閾値以下の場合は常に表示
    if (currentScroll <= scrollThreshold) {
      header.style.transform = "translateY(0)";
    }
    // 下にスクロールした場合、ヘッダーを隠す
    else if (currentScroll > lastScrollTop) {
      header.style.transform = "translateY(-100%)";
    }
    // 上にスクロールした場合、ヘッダーを表示
    else {
      header.style.transform = "translateY(0)";
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  },
  false
);

// スクロールアニメーション
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// .scroll-fadeクラスを持つ全ての要素を監視
document.addEventListener("DOMContentLoaded", () => {
  const scrollElements = document.querySelectorAll(".scroll-fade");
  scrollElements.forEach((el) => observer.observe(el));
});
