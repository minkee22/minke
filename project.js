(function () {
  var id = new URLSearchParams(location.search).get("id") || "trashion";
  // 물려받은 속성(constructor, toString 등)이 프로젝트로 통과해서
  // 페이지가 깨지지 않도록, 실제로 정의된 키인지 확인한다.
  var d = Object.prototype.hasOwnProperty.call(DETAILS, id) ? DETAILS[id] : null;
  if (!d) {
    // 주소창의 id 값을 innerHTML 로 넣으면 조작된 링크가 방문자 브라우저에서
    // 스크립트를 실행시킨다. 문자열이 아니라 텍스트 노드로 넣어 차단한다.
    document.body.textContent = "";
    var miss = document.createElement("p");
    miss.style.color = "#888";
    miss.style.fontFamily = "monospace";
    miss.style.padding = "40px";
    miss.textContent = "unknown project: " + id;
    document.body.appendChild(miss);
    return;
  }

  document.title = d.title + " — EUNBYN AN";
  var pageHeading = document.getElementById("pageHeading");
  if (pageHeading) pageHeading.textContent = d.title + " — EUNBYN AN";

  var counter = document.getElementById("counter");
  var prev = document.getElementById("prevBtn");
  var next = document.getElementById("nextBtn");
  var noteStage = document.getElementById("noteStage");
  var albumStage = document.getElementById("albumStage");
  // 쓰지 않는 모드의 무대는 반드시 지운다. 남겨두면 화면 전체를 덮어
  // 클릭을 가로챈다(.strip-stage 는 position:fixed; inset:0).
  var stripStageEl = document.getElementById("stripStage");
  var envStageEl = document.getElementById("envStage");
  var csStageEl = document.getElementById("csStage");
  var igStageEl = document.getElementById("igStage");
  var igModalEl = document.getElementById("igModal");
  var cur = 0;
  var total = 0;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var LETTERS = ["a", "b", "c", "d", "e"];

  function frame() {
    counter.textContent = pad(cur + 1) + " / " + pad(total);
    prev.disabled = cur === 0;
    next.disabled = cur === total - 1;
  }

  function go(delta) {
    var n = cur + delta;
    if (n < 0 || n >= total) return;
    cur = n;
    render();
  }

  prev.addEventListener("click", function (e) { e.stopPropagation(); go(-1); });
  next.addEventListener("click", function (e) { e.stopPropagation(); go(1); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  // 폰에서는 화살표를 누르는 대신 옆으로 쓸어 장을 넘긴다.
  // 마우스는 기존 클릭 동작을 그대로 두고, 손가락·펜에만 반응한다.
  function attachSwipe(el) {
    if (!el) return;
    var x0 = 0, y0 = 0, t0 = 0, tracking = false, lastWasTouch = false;
    var maxDx = 0;
    var MIN_DIST = 32;    // 이보다 짧으면 넘김이 아니라 탭으로 본다
    var MAX_TIME = 1200;  // 이보다 오래 끌면 넘길 의도가 아니라고 본다

    el.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") return;
      lastWasTouch = true;
      tracking = true;
      x0 = e.clientX;
      y0 = e.clientY;
      t0 = e.timeStamp;
      maxDx = 0;
    });

    el.addEventListener("pointermove", function (e) {
      if (!tracking) return;
      var dx = e.clientX - x0;
      if (Math.abs(dx) > Math.abs(maxDx)) maxDx = dx;
    });

    // 가로로 충분히 갔고, 세로보다 가로로 더 많이 갔으면 넘김으로 본다.
    // 세로 흔들림을 절대값으로 자르면 엄지로 호를 그리는 자연스러운 스와이프가 걸러진다.
    function settle(e) {
      if (!tracking) return;
      tracking = false;
      if (e.timeStamp - t0 > MAX_TIME) return;
      var dx = e.clientX - x0;
      var dy = e.clientY - y0;
      // 손을 떼기 직전에 살짝 되돌아오는 경우가 있어, 지나간 최대 거리도 함께 본다.
      if (Math.abs(maxDx) > Math.abs(dx)) dx = maxDx;
      if (Math.abs(dx) < MIN_DIST) return;
      if (Math.abs(dx) <= Math.abs(dy)) return;
      // 왼쪽으로 쓸면 다음 장, 오른쪽으로 쓸면 이전 장
      go(dx < 0 ? 1 : -1);
    }

    el.addEventListener("pointerup", settle);
    el.addEventListener("pointercancel", settle);

    // 손가락으로 만진 뒤 따라오는 click 은 모두 삼킨다.
    // 탭으로 넘기는 동작을 없애고 쓸어넘김만 남기기 위해서다.
    // 마우스 클릭은 이 경로를 타지 않으므로 그대로 동작한다.
    el.addEventListener("click", function (e) {
      if (lastWasTouch) {
        lastWasTouch = false;
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
  }

  var render;

  // ══════════ 인스타그램형 (프로필 그리드 + 모달) ══════════
  if (d.instagram) {
    document.body.classList.add("ig-mode");
    noteStage.remove();
    albumStage.remove();
    stripStageEl.remove();
    envStageEl.remove();
    csStageEl.remove();
    document.getElementById("pager").remove();
    // 이 페이지는 세로 스크롤이 필요하다
    document.documentElement.style.overflowY = "auto";
    document.documentElement.style.overflowX = "hidden";

    var posts = d.posts;
    var acct = d.account;

    document.getElementById("igId").textContent = acct.id;
    document.getElementById("igBio").textContent = acct.bio;
    document.getElementById("igStats").textContent =
      posts.length + " POSTS · 360° TURNTABLE";
    document.getElementById("igAvatar").style.backgroundImage = 'url("memo14/profile.jpg")';
    document.getElementById("igSideAv").style.backgroundImage = 'url("memo14/profile.jpg")';
    document.getElementById("igSideId").textContent = acct.id;
    document.getElementById("igCapId").textContent = acct.id;
    if (acct.link) {
      var lk = document.getElementById("igLink");
      lk.textContent = acct.link;
      lk.href = "https://" + acct.link;
    }

    // 좋아요는 브라우저에 저장해 새로고침해도 남는다
    var LKEY = "habit_likes";
    var likes = {};
    try { likes = JSON.parse(localStorage.getItem(LKEY) || "{}"); } catch (err) { likes = {}; }
    function saveLikes() {
      try { localStorage.setItem(LKEY, JSON.stringify(likes)); } catch (err) {}
    }
    // 게시물마다 고정된 기본 좋아요 수 (키에서 만들어 항상 같은 값)
    function baseLikes(k) {
      var n = 0;
      for (var i = 0; i < k.length; i++) n = (n * 31 + k.charCodeAt(i)) % 900;
      return 120 + n;
    }

    var HEART_SVG =
      '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 21s-8.5-5.4-8.5-11A4.7 4.7 0 0 1 12 7.2 4.7 4.7 0 0 1 20.5 10c0 5.6-8.5 11-8.5 11z"/></svg>';

    var grid = document.getElementById("igGrid");
    var vids = [];

    posts.forEach(function (p, i) {
      var tile = document.createElement("div");
      tile.className = "ig-tile" + (likes[p.key] ? " liked" : "");

      var v = document.createElement("video");
      v.src = p.video;
      v.poster = p.poster;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      v.preload = "metadata";
      tile.appendChild(v);

      var over = document.createElement("div");
      over.className = "ig-tile-over";
      over.innerHTML =
        '<span class="t">' + p.title + "</span>" +
        '<span class="l">' + HEART_SVG + "<span>" +
        (baseLikes(p.key) + (likes[p.key] ? 1 : 0)) + "</span></span>";
      tile.appendChild(over);

      var mark = document.createElement("div");
      mark.className = "ig-liked-mark";
      mark.innerHTML = HEART_SVG;
      tile.appendChild(mark);

      tile.addEventListener("click", function () { openPost(i); });
      grid.appendChild(tile);

      // 시작 지점을 조금씩 어긋나게 두어 12개가 한꺼번에 같은 각도로 돌지 않게 한다
      var offset = (i * 10) / posts.length;
      v.addEventListener("loadedmetadata", function () {
        try { v.currentTime = offset % (v.duration || 10); } catch (err) {}
        tile.classList.add("ready");
      });

      vids.push({ el: v, tile: tile });
    });

    // 화면에 보이는 타일만 재생한다 (12개 동시 디코딩 부담을 줄임)
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) { v.play().catch(function () {}); }
          else { v.pause(); }
        });
      }, { rootMargin: "200px 0px" });
      vids.forEach(function (o) { io.observe(o.el); });
    } else {
      vids.forEach(function (o) { o.el.play().catch(function () {}); });
    }

    // ── 모달 ──
    var modal = document.getElementById("igModal");
    var slidesEl = document.getElementById("igSlides");
    var dotsEl = document.getElementById("igDots");
    var prevBtn = document.getElementById("igPrev");
    var nextBtn = document.getElementById("igNext");
    var heartBtn = document.getElementById("igHeart");
    var likesEl = document.getElementById("igLikes");
    var cur = 0, slideCount = 0, curPost = null;

    function renderSlides(p) {
      slidesEl.innerHTML = "";
      var v = document.createElement("video");
      v.src = p.video;
      v.poster = p.poster;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.autoplay = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      slidesEl.appendChild(v);
      p.slides.forEach(function (u) {
        var im = document.createElement("img");
        im.src = u;
        im.alt = p.title;
        slidesEl.appendChild(im);
      });
      slideCount = 1 + p.slides.length;
      dotsEl.innerHTML = "";
      for (var i = 0; i < slideCount; i++) dotsEl.appendChild(document.createElement("i"));
      slideTo(0);
    }

    // 이름을 분리한다. 바깥 페이저의 go(delta) 와 같은 이름이면
    // 블록 함수 호이스팅 때문에 전역 방향키 핸들러가 이 함수를 대신 호출한다.
    function slideTo(n) {
      cur = Math.max(0, Math.min(n, slideCount - 1));
      slidesEl.style.transform = "translateX(" + (-cur * 100) + "%)";
      prevBtn.disabled = cur === 0;
      nextBtn.disabled = cur === slideCount - 1;
      [].forEach.call(dotsEl.children, function (el, i) {
        el.className = i === cur ? "on" : "";
      });
    }

    function paintHeart() {
      var on = !!likes[curPost.key];
      heartBtn.classList.toggle("on", on);
      likesEl.textContent =
        (baseLikes(curPost.key) + (on ? 1 : 0)).toLocaleString() + " likes";
    }

    // 게시물마다 고정된 댓글 수·경과일 (키에서 만들어 항상 같은 값)
    function seeded(k, mod, add) {
      var n = 0;
      for (var i = 0; i < k.length; i++) n = (n * 17 + k.charCodeAt(i)) % mod;
      return n + add;
    }

    function openPost(i) {
      curPost = posts[i];
      document.getElementById("igTitle").textContent = curPost.title;
      document.getElementById("igCaption").textContent = curPost.caption;
      document.getElementById("igTags").textContent =
        curPost.hashtags.map(function (t) { return "#" + t; }).join("  ");
      document.getElementById("igComments").textContent =
        "View all " + seeded(curPost.key, 180, 12) + " comments";
      var days = seeded(curPost.key, 20, 1);
      document.getElementById("igTime").textContent =
        days === 1 ? "1 day ago" : days + " days ago";
      renderSlides(curPost);
      paintHeart();
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closePost() {
      modal.hidden = true;
      slidesEl.innerHTML = "";
      document.body.style.overflow = "";
    }

    prevBtn.addEventListener("click", function () { slideTo(cur - 1); });
    nextBtn.addEventListener("click", function () { slideTo(cur + 1); });
    document.getElementById("igClose").addEventListener("click", closePost);
    document.getElementById("igModalBg").addEventListener("click", closePost);
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") closePost();
      if (e.key === "ArrowLeft") slideTo(cur - 1);
      if (e.key === "ArrowRight") slideTo(cur + 1);
      e.stopPropagation();
    });

    heartBtn.addEventListener("click", function () {
      likes[curPost.key] = !likes[curPost.key];
      if (!likes[curPost.key]) delete likes[curPost.key];
      saveLikes();
      paintHeart();
      var idx = posts.indexOf(curPost);
      var t = grid.children[idx];
      t.classList.toggle("liked", !!likes[curPost.key]);
      t.querySelector(".ig-tile-over .l span").textContent =
        baseLikes(curPost.key) + (likes[curPost.key] ? 1 : 0);
    });

    return;
  }

  // ══════════ 케이스 스터디형 (Behance식 세로 스크롤) ══════════
  if (d.casestudy) {
    document.body.classList.add("cs-mode");
    noteStage.remove();
    albumStage.remove();
    stripStageEl.remove();
    envStageEl.remove();
    igStageEl.remove();
    igModalEl.remove();
    document.getElementById("pager").remove();
    // 상세 페이지 공통의 overflow:hidden 을 이 페이지만 해제 (세로 스크롤 필요)
    document.documentElement.style.overflowY = "auto";
    document.documentElement.style.overflowX = "hidden";

    document.getElementById("csTitle").textContent = d.title;
    var csBody = document.getElementById("csBody");

    d.sections.forEach(function (s) {
      var sec = document.createElement("section");
      sec.className = "cs-section";

      var head = document.createElement("div");
      head.className = "cs-sechead";
      head.innerHTML =
        '<span class="cs-no">' + s.no + '</span>' +
        '<span class="cs-name">' + s.name + '</span>' +
        '<span class="cs-code">' + s.code + '</span>';
      sec.appendChild(head);

      if (s.blurb) {
        var b = document.createElement("p");
        b.className = "cs-blurb";
        b.textContent = s.blurb;
        sec.appendChild(b);
      }

      s.rows.forEach(function (r) {
        if (r.type === "hero") {
          var h = document.createElement("div");
          h.className = "cs-hero";
          h.innerHTML = '<img src="' + r.img + '" alt="' + s.name + '" loading="lazy">';
          sec.appendChild(h);
        } else if (r.type === "grid") {
          var g = document.createElement("div");
          g.className = "cs-grid";
          g.style.gridTemplateColumns = "repeat(" + r.imgs.length + ", 1fr)";
          g.innerHTML = r.imgs.map(function (u) {
            return '<img src="' + u + '" alt="' + s.name + ' view" loading="lazy">';
          }).join("");
          sec.appendChild(g);
        } else if (r.type === "process") {
          var p = document.createElement("div");
          p.className = "cs-process";
          p.innerHTML =
            '<div class="imgs" style="grid-template-columns:repeat(' + r.imgs.length + ',1fr)">' +
            r.imgs.map(function (u) {
              return '<img src="' + u + '" alt="process" loading="lazy">';
            }).join("") +
            '</div>' +
            (r.note ? '<div class="note">' + r.note + '</div>' : '');
          sec.appendChild(p);
        }
      });

      csBody.appendChild(sec);
    });

    var foot = document.createElement("div");
    foot.className = "cs-footer";
    foot.textContent = "ALL GARMENTS DESIGNED AND SIMULATED IN CLO 3D";
    csBody.appendChild(foot);

    return;
  }

  // ══════════ 봉투형 ══════════
  if (d.envelope) {
    document.body.classList.add("env-mode");
    noteStage.remove();
    albumStage.remove();
    stripStageEl.remove();
    csStageEl.remove();
    igStageEl.remove();
    igModalEl.remove();
    document.getElementById("pager").remove();

    var pdfBtn = document.getElementById("pdfBtn");
    pdfBtn.href = d.pdf || "#";
    pdfBtn.innerHTML =
      '<span class="pdf-a">Read the full story ↗</span>' +
      '<span class="pdf-b">Open full portfolio (PDF) ↗</span>';
    var row = document.getElementById("envRow");

    d.envelopes.forEach(function (e) {
      var box = document.createElement("div");
      box.className = "env";

      var card = document.createElement("div");
      card.className = "env-card";
      var fig = document.createElement("img");
      fig.alt = "look";
      fig.draggable = false;
      card.appendChild(fig);
      var lab = document.createElement("div");
      lab.className = "env-label";
      card.appendChild(lab);
      box.appendChild(card);

      [["memo4/env-back.png", "env-back"],
       ["memo4/env-body.png", "env-body"],
       ["memo4/env-closed.png", "env-closed"],
       ["memo4/env-wing.png", "env-wing"]].forEach(function (pair) {
        var im = document.createElement("img");
        im.className = "env-layer " + pair[1];
        im.src = pair[0];
        im.alt = "";
        im.draggable = false;
        box.appendChild(im);
      });

      var cue = document.createElement("div");
      cue.className = "env-cue";
      cue.textContent = "Open";
      box.appendChild(cue);

      var hit = document.createElement("div");
      hit.className = "env-hit";
      box.appendChild(hit);

      // 열 때마다 사진과 문구를 각각 무작위로 — 직전 것과는 겹치지 않게
      function randomPicker(list) {
        var last = -1;
        return function () {
          if (list.length === 1) return list[0];
          var i;
          do { i = Math.floor(Math.random() * list.length); } while (i === last);
          last = i;
          return list[i];
        };
      }
      var pick = randomPicker(e.photos);
      var pickLabel = randomPicker(e.labels || [""]);
      // 카드는 열기 전까지 보이지 않는다. 사진을 미리 받지 않고 처음 열 때 채운다.
      lab.textContent = pickLabel();

      hit.addEventListener("mouseenter", function () { box.classList.add("is-hover"); warm(); });
      hit.addEventListener("mouseleave", function () { box.classList.remove("is-hover"); });

      hit.addEventListener("click", function () {
        var opening = !box.classList.contains("is-open");
        if (opening) {
          warm();
          fig.src = pick();
          lab.textContent = pickLabel();
        }
        box.classList.toggle("is-open", opening);
        cue.textContent = opening ? "Close" : "Open";
      });

      // 커서가 봉투에 닿으면 그때 이 봉투 사진만 미리 받는다 (열 의사 표시)
      var warmed = false;
      function warm() {
        if (warmed) return;
        warmed = true;
        e.photos.forEach(function (p) { var im = new Image(); im.src = p; });
      }

      row.appendChild(box);
    });

    return;
  }

  // ══════════ 스트립형 (가로 흐름) ══════════
  if (d.strip) {
    document.body.classList.add("strip-mode");
    noteStage.remove();
    albumStage.remove();
    envStageEl.remove();
    csStageEl.remove();
    igStageEl.remove();
    igModalEl.remove();
    document.getElementById("pager").remove();

    var stripStage = document.getElementById("stripStage");
    var viewport = document.getElementById("stripViewport");
    var track = document.getElementById("stripTrack");
    document.getElementById("stripTitle").textContent = d.title;

    // 모든 사진이 같은 규격으로 흐른다 (비율이 다른 원본은 잘려서 채워짐)
    var SZ = d.size || { h: 58, ratio: 0.68 };
    var MAX_TOP = 100 - SZ.h - 12;   // 사진 아래 번호까지 화면 안에 들어오도록 제한

    // 커버플로우: 화면 중앙 사진이 정면·최대, 양옆으로 갈수록 눕고 작아지고 뒤로 밀린다.
    var CF = d.coverflow || { top: 20, visible: 7, spread: 3, overlap: 1.06, maxRotate: 25, edgeScale: 0.952, depth: 60, fade: 0.12, blur: 3, dim: 0.22, start: 3, hoverScale: 1.03, pauseZone: 0.6 };

    // 폰에서는 details.js 의 mobile 값으로 덮어쓴다. 창 크기가 바뀌면 다시 판정한다.
    // matchMedia 객체를 담아 두면 파이어폭스·사파리에서 resize 시점에 아직
    // 갱신되지 않은 값을 읽는다. 매번 새로 물어봐야 한다.
    function isMobile() { return window.matchMedia("(max-width: 760px)").matches; }
    var CFV = {};
    function resolveCF() {
      var src = isMobile() && CF.mobile ? CF.mobile : null;
      ["top", "visible", "spread", "overlap", "maxRotate", "edgeScale", "depth", "fade", "blur", "dim", "hoverScale", "pauseZone"].forEach(function (k) {
        CFV[k] = src && src[k] !== undefined ? src[k] : CF[k];
      });
    }
    resolveCF();

    d.photos.forEach(function (p, i) {
      var item = document.createElement("div");
      item.className = "strip-item";
      // vh 단위 사용: CSS의 margin-top 백분율은 부모의 '폭' 기준으로 계산되어
      // 가로로 긴 트랙에서는 세로 위치가 엉뚱하게 잡힌다.
      // 실제 크기는 measure() 에서 칸 폭에 맞춰 px 로 정해진다
      // 실제 세로 위치는 measure() 가 px 로 정한다
      item.style.top = "0px";

      var img = document.createElement("img");
      img.src = p.img;
      img.alt = d.title + " " + (i + 1);
      img.draggable = false;
      item.appendChild(img);

      var num = document.createElement("div");
      num.className = "strip-num";
      num.textContent = (i + 1 < 10 ? "0" : "") + (i + 1);
      item.appendChild(num);

      track.appendChild(item);
    });

    ["left", "right"].forEach(function (side) {
      var e = document.createElement("div");
      e.className = "strip-edge " + side;
      stripStage.appendChild(e);
    });

    // 폰에서는 좌우로 넘길 수 있다는 신호가 약하다. 진행 막대를 두어
    // 현재 위치를 보여 주고, 막대를 끌어서도 넘길 수 있게 한다.
    var scrub = document.createElement("div");
    scrub.className = "strip-scrub";
    var scrubThumb = document.createElement("div");
    scrubThumb.className = "strip-scrub-thumb";
    scrub.appendChild(scrubThumb);
    stripStage.appendChild(scrub);

    var scrubbing = false;
    var grabDX = 0;          // 손잡이 안에서 잡은 지점 (손잡이 왼쪽 끝 기준)

    // 손잡이의 왼쪽 끝이 가야 할 위치로부터 스크롤 값을 낸다.
    function scrubToThumbLeft(leftPx) {
      var r = scrub.getBoundingClientRect();
      var tw = scrubThumb.getBoundingClientRect().width;
      var travel = Math.max(1, r.width - tw);
      var t = Math.min(1, Math.max(0, leftPx / travel));
      viewport.scrollLeft = t * MAX_SCROLL;
    }

    scrub.addEventListener("pointerdown", function (e) {
      var r = scrub.getBoundingClientRect();
      var tr = scrubThumb.getBoundingClientRect();
      if (e.clientX >= tr.left && e.clientX <= tr.right) {
        // 손잡이를 잡았다 — 잡은 자리를 유지한 채 따라온다
        grabDX = e.clientX - tr.left;
      } else {
        // 빈 트랙을 눌렀다 — 손잡이 가운데가 그 자리로 온다
        grabDX = tr.width / 2;
        scrubToThumbLeft(e.clientX - r.left - grabDX);
      }
      scrubbing = true;
      // 합성 포인터 이벤트에서는 이 호출이 예외를 던질 수 있다.
      // 아래 preventDefault 까지 막히지 않도록 감싼다.
      try { scrub.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });

    scrub.addEventListener("pointermove", function (e) {
      if (!scrubbing) return;
      var r = scrub.getBoundingClientRect();
      scrubToThumbLeft(e.clientX - r.left - grabDX);
    });

    ["pointerup", "pointercancel"].forEach(function (ev) {
      scrub.addEventListener(ev, function (e) {
        scrubbing = false;
        try {
          if (scrub.hasPointerCapture && scrub.hasPointerCapture(e.pointerId)) scrub.releasePointerCapture(e.pointerId);
        } catch (err) {}
      });
    });

    // 커서가 화면 가운데면 정지, 좌우 끝으로 갈수록 그쪽으로 빠르게 흐른다
    var DEAD = 0.16;      // 가운데 정지 구간 (좌우 각각 16%)
    var MAX_SPEED = 26;   // 한 프레임 최대 이동 픽셀
    var speed = 0;
    var pointerInside = false;

    viewport.addEventListener("mousemove", function (e) {
      pointerInside = true;
      var t = (e.clientX / window.innerWidth - 0.5) * 2;   // -1(왼쪽 끝) ~ 1(오른쪽 끝)
      var mag = Math.abs(t);
      if (mag <= DEAD) { speed = 0; return; }
      var k = (mag - DEAD) / (1 - DEAD);
      speed = Math.sign(t) * k * k * MAX_SPEED;
    });
    viewport.addEventListener("mouseleave", function () {
      pointerInside = false;
      speed = 0;
    });

    // 사진을 '칸(slot)' 단위로 균등 배치한다.
    // 칸 폭 = 화면폭 / 보이는 장수  → 한 화면에 정확히 CFV.visible 장이 들어온다.
    var itemEls = [].slice.call(track.children);
    var geo = [];
    var SLOT = 1;
    var VIEW_W = 1;
    var MAX_SCROLL = 1;
    var PREV_SLOT = 0;
    // tick() 이 매 프레임 기록해 두는 '지금 가운데 있는 사진' 번호.
    // resize 핸들러에서 scrollLeft 를 읽으면 이미 브라우저가 잘라낸 뒤라 늦다.
    var LAST_CENTER = -1;
    function measure() {
      resolveCF();
      var vw = viewport.clientWidth;
      SLOT = vw / CFV.visible;

      // 사진 크기를 칸 폭에 맞춘다 → 화면 비율이 달라져도 겹침 정도가 일정하다.
      // 단, 세로가 화면을 넘지 않도록 SZ.h(vh) 를 상한으로 둔다.
      var wantW = SLOT * (CFV.overlap || 1.06);
      var maxH = window.innerHeight * (SZ.h / 100);
      var h = Math.min(wantW / SZ.ratio, maxH);
      var w = h * SZ.ratio;
      itemEls.forEach(function (el) {
        el.style.width = w + "px";
        el.style.height = h + "px";
      });

      // 폰에서는 사진이 커진 만큼 화면 한가운데로 앉힌다.
      // 데스크톱은 설정값 top(vh) 그대로.
      var topPx;
      if (isMobile()) {
        // 화면 정중앙에 앉히되, 위쪽 막대(최대 아래끝 112px) 밑으로는 올라가지 않는다.
        topPx = Math.max(122, (window.innerHeight - h) / 2);
      } else {
        var baseTopNow = Math.min(CFV.top, MAX_TOP);
        topPx = window.innerHeight * baseTopNow / 100;
      }
      itemEls.forEach(function (el) { el.style.top = topPx + "px"; });

      var startLeft = (vw - w) / 2;              // 0번 사진이 화면 정중앙에 오도록
      itemEls.forEach(function (el, i) {
        el.style.left = (startLeft + i * SLOT) + "px";
      });
      // 첫 장과 마지막 장이 모두 중앙까지 올 수 있는 길이
      track.style.width = (vw + (itemEls.length - 1) * SLOT) + "px";
      // 스크롤 한계와 화면폭을 여기서 한 번만 재둔다. 매 프레임 다시 읽으면
      // 방금 쓴 스타일 때문에 브라우저가 레이아웃을 강제로 다시 계산한다.
      VIEW_W = vw;
      MAX_SCROLL = (itemEls.length - 1) * SLOT;
      geo = itemEls.map(function (el, i) {
        return { el: el, i: i, hv: 0 };
      });

      // 칸 폭이 바뀌면(데스크톱 ↔ 폰) 가운데 있던 사진이 계속 가운데 오도록 다시 맞춘다.
      // 위치는 tick() 이 프레임마다 기록해 둔 값을 쓴다 — resize 시점의 scrollLeft 는
      // 이미 새 화면 크기에 맞춰 잘려 있어 믿을 수 없다.
      if (LAST_CENTER >= 0 && PREV_SLOT && PREV_SLOT !== SLOT) {
        viewport.scrollLeft = Math.min(MAX_SCROLL, Math.max(0, LAST_CENTER * SLOT));
      }
      PREV_SLOT = SLOT;
    }
    measure();
    window.addEventListener("resize", measure);

    // 진입 시 지정한 번호의 사진이 가운데에 오도록 시작 위치를 맞춘다
    viewport.scrollLeft = Math.max(0, ((CF.start || 1) - 1)) * SLOT;

    // 커서가 올라간 사진 추적
    var hoveredEl = null;
    track.addEventListener("mouseover", function (e) {
      var it = e.target.closest ? e.target.closest(".strip-item") : null;
      if (it) hoveredEl = it;
    });
    track.addEventListener("mouseout", function (e) {
      var to = e.relatedTarget;
      if (!to || !to.closest || !to.closest(".strip-item")) hoveredEl = null;
    });

    var hoverPause = false;

    function applyCoverflow() {
      var vw = VIEW_W;
      var sl = viewport.scrollLeft;
      var pos = sl / SLOT;                       // 현재 화면 중앙에 온 사진 번호(소수)
      // 소실점을 항상 화면 중앙에 둔다 (트랙이 매우 길기 때문에 매 프레임 갱신)
      track.style.perspectiveOrigin = (sl + vw / 2) + "px 50%";
      hoverPause = false;

      for (var j = 0; j < geo.length; j++) {
        var g = geo[j];
        var off = g.i - pos;                     // 중앙에서 몇 칸 떨어졌나 (부호 있음)
        var ao = Math.abs(off);
        var a = Math.min(ao / CFV.spread, 1);     // 회전·깊이·페이드용 0~1

        // 커서 반응은 부드럽게 따라붙는다
        var target = (g.el === hoveredEl) ? 1 : 0;
        g.hv += (target - g.hv) * 0.18;
        if (target === 1 && ao <= CFV.pauseZone) hoverPause = true;

        // 중앙이 1.0, 양 끝이 edgeScale — 가운데가 끝보다 (1 / edgeScale)배 크다
        var scale = (1 - (1 - CFV.edgeScale) * a) * (1 + (CFV.hoverScale - 1) * g.hv);
        var rot = CFV.maxRotate * (off >= 0 ? a : -a);

        g.el.style.transform =
          "translateZ(" + (-a * CFV.depth).toFixed(1) + "px)" +
          " rotateY(" + rot.toFixed(2) + "deg)" +
          " scale(" + scale.toFixed(4) + ")";
        g.el.style.zIndex = String(Math.round(1000 - ao * 100));
        g.el.style.opacity = (1 - CFV.fade * a).toFixed(3);

        // 심도 — 가운데만 선명하고 밝다. 커서를 올린 사진은 다시 또렷해진다.
        var focus = a * (1 - g.hv);
        g.el.style.filter =
          "blur(" + (CFV.blur * focus).toFixed(2) + "px)" +
          " brightness(" + (1 - CFV.dim * focus).toFixed(3) + ")";
      }
    }

    function tick() {
      // 읽기를 먼저, 쓰기를 나중에. 순서를 섞으면 매 프레임 레이아웃이 강제 재계산된다.
      if (pointerInside && speed !== 0 && !hoverPause) viewport.scrollLeft += speed;
      var sl = viewport.scrollLeft;
      if (SLOT > 0) LAST_CENTER = Math.round(sl / SLOT);
      applyCoverflow();

      // 막대 두께는 전체 중 보이는 비율, 위치는 현재 스크롤 비율
      var frac = MAX_SCROLL > 0 ? sl / MAX_SCROLL : 0;
      var visFrac = Math.min(1, VIEW_W / (VIEW_W + MAX_SCROLL));
      scrubThumb.style.width = (visFrac * 100) + "%";
      scrubThumb.style.left = (frac * (100 - visFrac * 100)) + "%";

      stripStage.classList.toggle("at-start", sl <= 2);
      stripStage.classList.toggle("at-end", sl >= MAX_SCROLL - 2);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    return;   // 스트립형은 페이지 넘김 개념이 없으므로 여기서 끝
  }

  // ══════════ 앨범형 ══════════
  if (d.album) {
    document.body.classList.add("album-mode");
    noteStage.remove();
    stripStageEl.remove();
    envStageEl.remove();
    csStageEl.remove();
    igStageEl.remove();
    igModalEl.remove();

    // 사진을 perPage 개수대로 페이지에 나눠 담는다
    var pages = [];
    var i = 0;
    for (var p = 0; p < d.perPage.length && i < d.photos.length; p++) {
      pages.push(d.photos.slice(i, i + d.perPage[p]));
      i += d.perPage[p];
    }
    while (i < d.photos.length) {          // perPage 합이 모자라면 3장씩 이어붙임
      pages.push(d.photos.slice(i, i + 3));
      i += 3;
    }
    total = pages.length;

    var area = document.getElementById("albumArea");
    var legend = document.getElementById("albumLegend");

    render = function () {
      var items = pages[cur];
      var layout = d.layouts[cur % d.layouts.length];
      area.innerHTML = "";
      legend.innerHTML = "";

      items.forEach(function (it, n) {
        var slot = layout[n % layout.length];
        var box = document.createElement("div");
        box.className = "album-photo";
        box.style.left = slot.x + "%";
        box.style.top = slot.y + "%";
        box.style.width = slot.w + "%";

        var img = document.createElement("img");
        img.src = it.img;
        img.alt = it.pose;
        img.draggable = false;
        box.appendChild(img);

        var tag = document.createElement("div");
        tag.className = "tag";
        tag.textContent = "(" + LETTERS[n] + ").";
        box.appendChild(tag);

        area.appendChild(box);

        var line = document.createElement("div");
        line.textContent = "(" + LETTERS[n] + "). " + it.pose;
        legend.appendChild(line);
      });

      frame();
      // 다음 페이지 사진 미리 받기
      var nx = pages[cur + 1];
      if (nx) nx.forEach(function (it) { var im = new Image(); im.src = it.img; });
    };

    // 좌우 가장자리 = 넘김 존. 커서가 화살표로 바뀌고 클릭하면 앞/뒤 장으로 간다.
    var albumHot = document.getElementById("albumHot");
    var albumStageEl = document.getElementById("albumStage");

    function makeEdge(side, delta, peelClass) {
      var z = document.createElement("div");
      z.className = "album-edge " + side;
      z.addEventListener("mouseenter", function () {
        if ((delta > 0 && cur < total - 1) || (delta < 0 && cur > 0)) {
          albumStageEl.classList.add(peelClass);
        }
      });
      z.addEventListener("mouseleave", function () {
        albumStageEl.classList.remove(peelClass);
      });
      z.addEventListener("click", function (e) {
        e.stopPropagation();
        albumStageEl.classList.remove(peelClass);
        go(delta);
      });
      // 앨범 종이 안쪽에 붙인다 (position:absolute).
      albumStageEl.appendChild(z);
    }
    makeEdge("right", 1, "peel");
    makeEdge("left", -1, "peel-left");

    // 가운데를 눌러도 다음 장으로 (기존 동작 유지)
    albumHot.addEventListener("click", function () { go(1); });
    attachSwipe(albumStage);

  // ══════════ 노트형 ══════════
  } else {
    document.body.classList.add("note-mode");
    albumStage.remove();
    stripStageEl.remove();
    envStageEl.remove();
    csStageEl.remove();
    igStageEl.remove();
    igModalEl.remove();
    document.getElementById("labelTitle").textContent = d.title;
    document.getElementById("labelSeason").textContent = d.season;
    document.getElementById("spec1").textContent = new Array(12).join(d.spec);

    var photo = document.getElementById("pagePhoto");
    var cap = document.getElementById("pageCaption");
    var spec2 = document.getElementById("spec2");
    var cover = document.getElementById("cover");
    var coverImg = document.getElementById("coverImg");
    var turnHot = document.getElementById("turnHot");
    total = d.pages.length;

    render = function () {
      var pg = d.pages[cur];
      if (pg.cover) {
        noteStage.classList.add("cover-mode");
        coverImg.src = pg.img;
        coverImg.alt = d.title + " cover";
      } else {
        noteStage.classList.remove("cover-mode");
        cover.classList.remove("peel");
        photo.src = pg.img;
        photo.alt = pg.caption || d.title;
        cap.textContent = pg.caption || "";
        spec2.textContent = pg.section || "";
      }
      frame();
      [cur + 1, cur - 1].forEach(function (k) {
        if (k >= 0 && k < d.pages.length) { var im = new Image(); im.src = d.pages[k].img; }
      });
    };

    turnHot.addEventListener("mouseenter", function () {
      if (noteStage.classList.contains("cover-mode")) cover.classList.add("peel");
    });
    turnHot.addEventListener("mouseleave", function () { cover.classList.remove("peel"); });
    turnHot.addEventListener("click", function () { go(1); });
    attachSwipe(noteStage);
  }

  render();
})();
