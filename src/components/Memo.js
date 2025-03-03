import React, { useState } from "react";

const Memo = () => {
  const [note, setNote] = useState("");

  return (
    <div className="memo">
      <h3>메모장</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="메모를 입력하세요..."
      />
    </div>
  );
};

export default Memo;
