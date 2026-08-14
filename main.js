(function () {
  var overlays = document.getElementById("overlays");
  document.getElementById("identityLine1").textContent = IDENTITY_LINE1;
  document.getElementById("identityLine2").textContent = IDENTITY_LINE2;
  document.getElementById("sigName").textContent = SIGNATURE;
  document.getElementById("sigEmail").textContent = SIGNATURE_EMAIL;

  // 손으로 붙인 느낌: 슬롯별 미세 회전 (고정값)
  var ROTS = [-0.4, 0.35, -0.2, 0.5, 0.25, -0.45, 0.4, -0.3,
              -0.35, 0.45, -0.5, 0.25, 0.45, -0.25, 0.35, -0.4];

  fetch("assets/card_boxes.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var boxes = {};
      data.boxes.forEach(function (b) { boxes[b.slot] = b; });

      var order = 0;
      SLOTS.forEach(function (s) {
        // 글자 카드 — 사진 없이 종이 위에 텍스트만 인쇄된 카드
        if (!s.image && s.text) {
          var tb = boxes[s.slot];
          if (!tb) return;
          var ta = document.createElement("a");
          ta.className = "text-card";
          ta.href = s.href || "#";
          if (s.newTab) { ta.target = "_blank"; ta.rel = "noopener"; }
          ta.style.left = tb.left + "%";
          ta.style.top = tb.top + "%";
          ta.style.width = tb.width + "%";
          ta.style.height = tb.height + "%";
          var inner = document.createElement("div");
          inner.className = "text-card-body";
          s.text.forEach(function (line) {
            var row = document.createElement("div");
            row.className = line ? "tc-line" : "tc-gap";
            row.textContent = line;
            inner.appendChild(row);
          });
          ta.appendChild(inner);
          overlays.appendChild(ta);
          return;
        }
        if (!s.image) return; // 빈 카드 = 구운 이미지 그대로, DOM 없음
        var b = boxes[s.slot];
        if (!b) return;

        var a = document.createElement("a");
        a.className = "photo-slot";
        a.href = s.href || "#";
        a.style.left = b.left + "%";
        a.style.top = b.top + "%";
        a.style.width = b.width + "%";
        a.style.height = b.height + "%";
        a.style.setProperty("--rot", ROTS[(s.slot - 1) % ROTS.length] + "deg");
        a.style.setProperty("--delay", (order * 0.06).toFixed(3) + "s");
        order += 1;

        var img = document.createElement("img");
        img.src = s.image;
        img.alt = s.title || "project";
        img.className = "photo-img";
        img.draggable = false;
        // 사진 위치: 종이 내접 박스(inner)에 2.5% 균일 여백 — 기울어진 종이에서도 프레임 보장
        var inn = b.inner || b;
        var mx = inn.width * 0.025, my = inn.height * 0.025;
        var pL = inn.left + mx, pT = inn.top + my;
        var pW = inn.width - mx * 2, pH = inn.height - my * 2;
        var photoBox = {
          left: (((pL - b.left) / b.width) * 100) + "%",
          top: (((pT - b.top) / b.height) * 100) + "%",
          width: ((pW / b.width) * 100) + "%",
          height: ((pH / b.height) * 100) + "%"
        };
        img.style.left = photoBox.left;
        img.style.top = photoBox.top;
        img.style.width = photoBox.width;
        img.style.height = photoBox.height;
        a.appendChild(img);

        // 사진과 정확히 같은 영역에 어두운 필름
        var scrim = document.createElement("div");
        scrim.className = "scrim";
        scrim.style.left = photoBox.left;
        scrim.style.top = photoBox.top;
        scrim.style.width = photoBox.width;
        scrim.style.height = photoBox.height;
        a.appendChild(scrim);

        // 핀은 보드 이미지에 핀이 실측된 경우에만 오버레이 (핀 없는 보드 디자인 대응)
        if (b.pin) {
          var pin = document.createElement("img");
          pin.src = "assets/pin.png";
          pin.alt = "";
          pin.className = "pin";
          pin.draggable = false;
          var ballX = b.pin.cx - b.pin.d * 0.12;
          var ballY = b.pin.cy - b.pin.d * 0.12;
          pin.style.left = (((ballX - b.left) / b.width) * 100) + "%";
          pin.style.top = (((ballY - b.top) / b.height) * 100) + "%";
          pin.style.width = ((b.pin.d * 1.65) / b.width * 100) + "%";
          a.appendChild(pin);
        }

        if (s.title) {
          var cap = document.createElement("div");
          cap.className = "caption";
          cap.textContent = s.title;
          // 캡션도 사진 영역 기준으로 중앙 정렬
          cap.style.top = "calc(" + photoBox.top + " + " + photoBox.height + " / 2)";
          a.appendChild(cap);
        }

        overlays.appendChild(a);
      });

      // 장식 스티커 (클릭 불가) — 카드 테두리 위로 걸쳐 올라감
      if (typeof DECOR !== "undefined") {
        DECOR.forEach(function (dec) {
          var db = boxes[dec.slot];
          if (!db) return;
          var el = document.createElement("img");
          el.src = dec.img;
          el.alt = "";
          el.className = "decor";
          el.draggable = false;
          el.style.left = (db.left + db.width * (dec.x / 100)) + "%";
          el.style.top = (db.top + db.height * (dec.y / 100)) + "%";
          el.style.width = (db.width * (dec.size / 100)) + "%";
          el.style.transform = "translate(-50%, -50%) rotate(" + dec.rotate + "deg)";
          overlays.appendChild(el);
        });
      }

      // 모든 카드(빈 카드 포함) 상단 중앙에 핀 스프라이트 오버레이
      data.boxes.forEach(function (bx) {
        var bpin = document.createElement("img");
        bpin.src = "assets/pin.png";
        bpin.alt = "";
        bpin.className = "board-pin";
        bpin.draggable = false;
        bpin.style.left = (bx.left + bx.width / 2) + "%";
        bpin.style.top = (bx.top + bx.height * 0.012) + "%";
        bpin.style.width = (bx.width * 0.17) + "%";
        overlays.appendChild(bpin);
      });
    });
})();
