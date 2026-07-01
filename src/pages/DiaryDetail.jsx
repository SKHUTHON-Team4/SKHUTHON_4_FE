import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDiary,
  getComments,
  createComment,
  deleteComment,
  getEmpathy,
  toggleEmpathy,
  report,
} from "../api";
import { EMOTION_IMAGE } from "../utils/emotion";
import useAuthStore from "../store/authStore";

const REPORT_REASONS = ["BAD_WORD", "SPAM", "INAPPROPRIATE", "OTHER"];
const REPORT_LABELS = ["욕설/비방", "스팸/광고", "부적절한 내용", "기타"];

export default function DiaryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [diary, setDiary] = useState(null);
  const [comments, setComments] = useState([]);
  const [empathy, setEmpathy] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    getDiary(id).then((r) => setDiary(r.data));
    getComments(id).then((r) => setComments(r.data));
    getEmpathy(id).then((r) => setEmpathy(r.data));
  }, [id]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardOffset(offset > 0 ? offset : 0);
    };

    vv.addEventListener("resize", handleResize);
    vv.addEventListener("scroll", handleResize);

    return () => {
      vv.removeEventListener("resize", handleResize);
      vv.removeEventListener("scroll", handleResize);
    };
  }, []);

  const handleEmpathy = () => toggleEmpathy(id).then((r) => setEmpathy(r.data));

  const handleComment = async () => {
    const content = commentText.trim();

    if (!content || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);

      const res = await createComment(id, content);
      setComments((prev) => [...prev, res.data]);
      setCommentText("");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = (commentId) =>
    deleteComment(commentId).then(() =>
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    );

  const openDiaryReport = () => {
    setReportTarget({ id: Number(id), type: "DIARY" });
    setShowReport(true);
  };

  const openCommentReport = (commentId) => {
    setReportTarget({ id: commentId, type: "COMMENT" });
    setShowReport(true);
  };

  const handleReport = async (reason) => {
    if (!reportTarget) return;

    try {
      await report(reportTarget.id, reportTarget.type, reason);
      alert("신고가 접수되었습니다.");
    } catch (err) {
      alert(err.response?.data?.message || "오류가 발생했습니다.");
    }

    setShowReport(false);
    setReportTarget(null);
  };

  if (!diary) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        불러오는 중...
      </div>
    );
  }

  const isMine = user && String(user.id) === String(diary.memberId);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white flex flex-col pb-40">
      <div className="mx-auto w-full max-w-[760px]">
        <header className="flex items-center justify-between px-5 pt-10 pb-4">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {!isMine && (
            <button onClick={openDiaryReport} className="text-xs text-gray-400">
              신고
            </button>
          )}
        </header>

        <div className="px-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary">
              {diary.nickname?.[0]}
            </div>

            <div>
              <p className="font-medium text-sm">{diary.nickname}</p>
              <p className="text-xs text-gray-400">{diary.diaryDate}</p>
            </div>

            {diary.emotion != null && (
              <img
                src={EMOTION_IMAGE[diary.emotion]}
                alt="emotion"
                className="w-9 h-9 ml-auto object-contain"
              />
            )}
          </div>

          {diary.title && (
            <h2 className="text-xl font-bold mb-3 [overflow-wrap:anywhere]">{diary.title}</h2>
          )}

          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line [overflow-wrap:anywhere]">
            {diary.content}
          </p>

          {empathy && (
            <button
              onClick={handleEmpathy}
              className={`mt-6 flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${empathy.isEmpathized
                  ? "border-primary text-primary bg-primary-light"
                  : "border-gray-200 text-gray-400"
                }`}
            >
              <span>❤️</span>
              <span className="text-sm">{empathy.empathyCount}</span>
            </button>
          )}
        </div>

        <div className="mt-6 px-5">
          <p className="font-semibold text-sm mb-3">댓글 {comments.length}</p>

          {comments.map((c) => (
            <div key={c.id} className="relative flex gap-3 mb-4 items-start pr-10">
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {c.nickname?.[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{c.nickname}</p>
                  <p className="text-xs text-gray-400 shrink-0">
                    {c.createdAt?.slice(0, 10)}
                  </p>
                </div>

                <p className="text-sm text-gray-700 mt-0.5 [overflow-wrap:anywhere]">
                  {c.content}
                </p>

                {user && String(user.id) === String(c.memberId) && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="text-xs text-gray-300 mt-1"
                  >
                    삭제
                  </button>
                )}
              </div>

              <button
                onClick={() => openCommentReport(c.id)}
                className="absolute right-0 top-0 text-xs text-gray-400"
              >
                신고
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        className="fixed left-0 right-0 bg-white border-t border-gray-100 transition-[bottom] duration-100"
        style={{ bottom: keyboardOffset }}
      >
        <div className="mx-auto w-full max-w-[760px] px-4 py-3 flex gap-2">
          <input
            ref={inputRef}
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-base outline-none"
            placeholder="댓글을 입력하세요 (최대 200자)"
            maxLength={200}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleComment();
              }
            }}
          />

          <button
            onClick={handleComment}
            disabled={isSubmittingComment}
            className="bg-primary text-white text-sm px-4 rounded-full disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            등록
          </button>
        </div>
      </div>

      {showReport && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50">
          <div className="bg-white w-full max-w-[760px] mx-auto rounded-t-3xl p-6">
            <h3 className="font-bold text-lg mb-4">신고 사유를 선택해주세요</h3>

            {REPORT_REASONS.map((r, i) => (
              <button
                key={r}
                onClick={() => handleReport(r)}
                className="w-full text-left py-3 border-b border-gray-100 text-sm last:border-0"
              >
                {REPORT_LABELS[i]}
              </button>
            ))}

            <button
              onClick={() => {
                setShowReport(false);
                setReportTarget(null);
              }}
              className="w-full mt-4 text-center text-gray-400 text-sm"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
