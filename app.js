"use strict";

const apiBase = window.CALCULATOR_API_BASE.replace(/\/$/, "");
const input = document.getElementById("expression");
const result = document.getElementById("result");
const message = document.getElementById("message");
const calculateButton = document.getElementById("calculate");
const historyList = document.getElementById("history-list");
const historyStatus = document.getElementById("history-status");
let historyRequest = 0;
let calculating = false;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(apiBase + path, {
      ...options, signal: controller.signal
    });
    const data = await response.json();
    if (!response.ok || data.success !== true) {
      throw new Error(data.message || `请求失败（HTTP ${response.status}）`);
    }
    return data;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("请求超时，请稍后刷新历史，确认是否已保存。");
    if (error instanceof TypeError) throw new Error("无法连接后端，请检查服务是否启动。");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

async function loadHistory() {
  const version = ++historyRequest;
  historyStatus.textContent = "正在读取…";
  try {
    const data = await request("/api/history");
    if (version !== historyRequest) return;
    historyList.replaceChildren();
    for (const record of data.history) {
      const item = document.createElement("li");
      item.className = "history-item";
      const detail = document.createElement("div");
      detail.className = "history-detail";
      const expression = document.createElement("div");
      expression.className = "history-expression";
      expression.textContent = record.expression;
      const value = document.createElement("div");
      value.className = "history-result";
      value.textContent = "= " + record.result;
      const time = document.createElement("time");
      time.className = "history-time";
      time.dateTime = record.createdAt;
      time.textContent = record.createdAt.replace("T", " ").slice(0, 19);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete";
      remove.textContent = "删除";
      remove.setAttribute("aria-label", `删除记录 ${record.id}：${record.expression}`);
      remove.addEventListener("click", async () => {
        if (!window.confirm(`删除这条记录？\n${record.expression} = ${record.result}`)) return;
        remove.disabled = true;
        try {
          await request(`/api/history/${record.id}`, { method: "DELETE" });
          historyRequest++;
          item.remove();
          await loadHistory();
        } catch (error) {
          historyStatus.textContent = error.message;
          remove.disabled = false;
        }
      });
      detail.append(expression, value, time);
      item.append(detail, remove);
      historyList.append(item);
    }
    historyStatus.textContent = data.history.length
      ? `共 ${data.history.length} 条 · 最新记录在前`
      : "还没有记录，完成一次计算后会显示在这里。";
  } catch (error) {
    if (version !== historyRequest) return;
    historyStatus.textContent = error.message + " 当前列表未更新。";
  }
}

document.getElementById("calculator-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (calculating) return;
  const expression = input.value.trim().replaceAll("×", "*").replaceAll("÷", "/").replaceAll("−", "-");
  if (!expression) { showMessage("请先输入算式。", true); return; }
  calculating = true;
  calculateButton.disabled = true;
  result.textContent = "—";
  showMessage("正在计算…");
  try {
    const data = await request("/api/calculate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression })
    });
    result.textContent = data.resultText ?? String(data.result);
    showMessage("已计算并保存：" + data.expression);
    await loadHistory();
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    calculateButton.disabled = false;
    calculating = false;
  }
});

document.querySelector(".keypad").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.type === "submit") return;
  if (button.dataset.action === "clear") {
    input.value = ""; result.textContent = "—"; showMessage("");
  } else {
    let start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    if (button.dataset.action === "backspace") {
      if (start === end) start = Math.max(0, start - 1);
      input.setRangeText("", start, end, "end");
    } else if (input.value.length - (end - start) < 200) {
      input.setRangeText(button.dataset.key, start, end, "end");
    }
  }
  input.focus();
});
input.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    input.value = ""; result.textContent = "—"; showMessage("");
  }
});
document.getElementById("refresh").addEventListener("click", loadHistory);
loadHistory();
