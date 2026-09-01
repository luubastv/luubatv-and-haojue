"use client";

import { FormEvent, useMemo, useState } from "react";

type Motorcycle = { model: string; price: number; use: string; note: string; color: string; finance?: string };
type ChatMessage = { role: "assistant" | "user"; content: string };
const WHATSAPP_NUMBER = "256745400500";

const motorcycles: Motorcycle[] = [
  { model: "NK150", price: 8430000, use: "Adventure", note: "For riders who want a bold, versatile 150cc option.", color: "#d32530" },
  { model: "DK150", price: 8130000, use: "Everyday", note: "A confident everyday motorcycle for town and open road.", color: "#1d2734" },
  { model: "Express", price: 5780000, use: "Business", note: "A practical choice for riders building a daily business.", color: "#d7921f", finance: "From UGX 950,000 deposit · UGX 105,000 weekly · 2 years" },
  { model: "Express Plus", price: 5980000, use: "Business", note: "Extra presence for demanding work and daily movement.", color: "#1a8457" },
  { model: "EG150", price: 6330000, use: "Everyday", note: "A balanced 150cc motorcycle for dependable daily riding.", color: "#275ea7" },
  { model: "EG125", price: 5980000, use: "Value", note: "An accessible entry into trusted everyday mobility.", color: "#7d374e" },
];

const topics = [
  { tag: "BUYER'S GUIDE", title: "How to choose a motorcycle for work, family and daily travel", copy: "Start with your daily distance, load, fuel budget and the roads you use most." },
  { tag: "ROAD STORIES", title: "The people moving business across Eastern Uganda", copy: "Luuba TV meets the riders and entrepreneurs keeping communities connected." },
  { tag: "OWNERSHIP", title: "What to ask before you apply for motorcycle financing", copy: "Understand the deposit, repayment plan and current requirements before you commit." },
];

function money(value: number) {
  return `UGX ${new Intl.NumberFormat("en-UG").format(value)}`;
}

function MotorcycleArt({ model, color }: { model: string; color: string }) {
  return <div className="bike-art" style={{ "--bike-color": color } as React.CSSProperties} aria-hidden="true">
    <span className="model-watermark">{model}</span>
    <svg viewBox="0 0 420 230"><circle cx="105" cy="170" r="48"/><circle cx="325" cy="170" r="48"/><path d="M105 170l58-68h74l32 68h-95l-31-52m94-16l52-25m-5-8h35m-214 101l55-3 51-75 36 7m-116-10h55m-21-19h34"/><path className="fill" d="M166 103c22-21 61-25 91-8l-17 32h-89z"/></svg>
  </div>;
}

export default function SalesWebsite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [selectedModel, setSelectedModel] = useState("Express");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! I can compare Haojue models, explain listed prices, or help you start a loan enquiry. Oli otya?" },
  ]);

  const filteredMotorcycles = useMemo(
    () => filter === "All" ? motorcycles : motorcycles.filter((bike) => bike.use === filter),
    [filter],
  );
  const whatsapp = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  function enquire(model: string) {
    window.open(whatsapp(`Hello Luuba TV, I am interested in the Haojue ${model}. Please share the current availability and buying options.`), "_blank", "noopener,noreferrer");
  }

  function submitLoan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) || "").trim();
    window.open(whatsapp(`Hello Luuba TV, I would like to apply for a Haojue motorcycle loan.\n\nName: ${value("name")}\nPhone: ${value("phone")}\nDistrict: ${value("district")}\nModel: ${value("model") || selectedModel}\nDeposit available: UGX ${value("deposit")}\n\nPlease contact me with the current terms and requirements.`), "_blank", "noopener,noreferrer");
  }

  async function sendChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = chatInput.trim();
    if (!content || chatBusy) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setChatInput("");
    setChatBusy(true);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.slice(-8) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Assistant unavailable");
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "I could not reach the assistant just now. Please WhatsApp our sales team on 0745 400 500 for immediate help." }]);
    } finally {
      setChatBusy(false);
    }
  }

  return <main>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Luuba TV home" onClick={() => setMenuOpen(false)}><span className="brand-mark">L</span><span><b>LUUBA</b><small>TV 256</small></span></a>
      <button className="menu-button" type="button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><span/><span/><span/></button>
      <nav className={menuOpen ? "nav-open" : ""} aria-label="Main navigation">
        <a href="#motorcycles" onClick={() => setMenuOpen(false)}>Motorcycles</a>
        <a href="#media" onClick={() => setMenuOpen(false)}>News & videos</a>
        <a href="#financing" onClick={() => setMenuOpen(false)}>Financing</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
      </nav>
      <a className="header-cta" href={whatsapp("Hello Luuba TV, I would like help choosing a Haojue motorcycle.")} target="_blank" rel="noreferrer">WhatsApp sales</a>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">MEDIA · MOTORCYCLES · OPPORTUNITY</p>
        <h1>Move your story<br/>forward.</h1>
        <p className="hero-lede">Watch Uganda’s stories. Find a Haojue motorcycle. Get clear sales help in one trusted place.</p>
        <p className="luganda">Laba amawulire. Londa pikipiki yo. Tutandike olugendo.</p>
        <div className="hero-actions"><a className="button button-red" href="#motorcycles">Browse motorcycles <span>→</span></a><a className="button button-ghost" href="https://www.youtube.com/@luubatv256" target="_blank" rel="noreferrer">Watch Luuba TV <span>▶</span></a></div>
        <div className="trust-row"><span><b>6</b> priced models</span><span><b>2</b> service locations</span><span><b>1</b> direct sales line</span></div>
      </div>
      <div className="hero-visual">
        <div className="sun-disc"/><div className="hero-bike"><MotorcycleArt model="HAOJUE" color="#ef2435"/></div>
        <div className="location-card"><span>Find us</span><b>Iganga & Kamuli</b><small>Call 0745 400 500</small></div>
        <div className="media-card"><span className="live-dot"/><b>LUUBA TV</b><small>Stories that move Uganda</small></div>
      </div>
    </section>

    <section className="ticker" aria-label="Services"><span>Haojue motorcycles</span><i>✦</i><span>Video & news</span><i>✦</i><span>Loan enquiries</span><i>✦</i><span>AI sales help</span><i>✦</i></section>

    <section className="section motorcycles" id="motorcycles">
      <div className="section-heading"><div><p className="eyebrow">HAOJUE MOTORCYCLES</p><h2>Choose your next move.</h2></div><p>Compare current listed cash prices, then talk directly with our team about availability and buying options.</p></div>
      <div className="filters" role="group" aria-label="Filter motorcycles">{["All", "Business", "Everyday", "Adventure", "Value"].map((item) => <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <div className="bike-grid">{filteredMotorcycles.map((bike) => <article className="bike-card" key={bike.model}>
        <MotorcycleArt model={bike.model} color={bike.color}/>
        <div className="bike-info"><div><span className="pill">{bike.use}</span><h3>Haojue {bike.model}</h3></div><p>{bike.note}</p><div className="price"><small>Listed cash price</small><b>{money(bike.price)}</b></div>{bike.finance ? <p className="finance-note"><b>Example financing:</b> {bike.finance}</p> : null}<button type="button" onClick={() => enquire(bike.model)}>Ask about {bike.model} <span>↗</span></button></div>
      </article>)}</div>
      <p className="price-disclaimer">Prices and financing terms can change. Confirm the current offer, availability and requirements with a Luuba TV sales representative before paying.</p>
    </section>

    <section className="media-section" id="media">
      <div className="media-feature"><div className="video-label"><span>▶</span> WATCH LUUBA TV</div><div><p className="eyebrow light">VIDEO · NEWS · COMMUNITY</p><h2>Ugandan stories,<br/>made to move.</h2><p>Follow reporting, road stories, buyer education and local business features from Luuba TV 256.</p><a className="button button-white" href="https://www.youtube.com/@luubatv256" target="_blank" rel="noreferrer">Open YouTube channel ↗</a></div></div>
      <div className="story-list"><div className="story-title"><p className="eyebrow">EDITORIAL</p><h3>What we cover</h3></div>{topics.map((topic, index) => <article key={topic.tag}><span>0{index + 1}</span><div><small>{topic.tag}</small><h4>{topic.title}</h4><p>{topic.copy}</p></div></article>)}</div>
    </section>

    <section className="section financing" id="financing">
      <div className="finance-copy"><p className="eyebrow">MOTORCYCLE FINANCING</p><h2>Start with what you can afford.</h2><p>Tell us the motorcycle you want and the deposit you have. A sales representative will contact you with the current terms and requirements.</p><div className="offer-card"><span>EXPRESS EXAMPLE</span><div><p><small>Deposit from</small><b>UGX 950,000</b></p><p><small>Weekly</small><b>UGX 105,000</b></p><p><small>Duration</small><b>2 years</b></p></div></div><ul><li>No payment is taken on this website.</li><li>Your enquiry opens securely in WhatsApp.</li><li>Final approval depends on the current lender requirements.</li></ul></div>
      <form className="loan-form" onSubmit={submitLoan}>
        <div className="form-heading"><span>01</span><div><p>LOAN ENQUIRY</p><h3>Let’s find your route.</h3></div></div>
        <label>Full name<input name="name" autoComplete="name" required placeholder="Your name"/></label>
        <div className="form-row"><label>Phone number<input name="phone" autoComplete="tel" inputMode="tel" required placeholder="07XX XXX XXX"/></label><label>District<input name="district" autoComplete="address-level1" required placeholder="e.g. Iganga"/></label></div>
        <label>Motorcycle<select name="model" value={selectedModel} onChange={(event) => setSelectedModel(event.target.value)}>{motorcycles.map((bike) => <option key={bike.model}>{bike.model}</option>)}</select></label>
        <label>Deposit available (UGX)<input name="deposit" inputMode="numeric" required placeholder="e.g. 950000"/></label>
        <button className="button button-red" type="submit">Continue in WhatsApp <span>→</span></button>
        <small className="privacy">By continuing, you choose to send these details to Luuba TV through WhatsApp so the sales team can contact you.</small>
      </form>
    </section>

    <section className="about-section" id="about"><div><p className="eyebrow light">WHY LUUBA TV 256</p><h2>Local voices.<br/>Real mobility.</h2></div><p>Luuba TV brings media and motorcycle sales together to help people make informed choices, connect with opportunity and move their lives forward.</p><div className="about-points"><span><b>01</b> Clear listed prices</span><span><b>02</b> Direct human support</span><span><b>03</b> Local media perspective</span></div></section>

    <footer className="site-footer">
      <div className="footer-brand"><span className="brand-mark">L</span><div><b>LUUBA TV 256</b><p>Stories, motorcycles and opportunity.</p></div></div>
      <div><small>VISIT</small><p>Iganga & Kamuli<br/>Uganda</p></div>
      <div><small>CONTACT</small><p><a href="tel:+256745400500">0745 400 500</a><br/><a href={whatsapp("Hello Luuba TV")}>WhatsApp sales</a></p></div>
      <div><small>WATCH</small><p><a href="https://www.youtube.com/@luubatv256" target="_blank" rel="noreferrer">YouTube ↗</a></p></div>
      <p className="copyright">© {new Date().getFullYear()} Luuba TV 256. All rights reserved.</p>
    </footer>

    <button className="assistant-launcher" type="button" onClick={() => setChatOpen((value) => !value)} aria-expanded={chatOpen} aria-controls="sales-assistant"><span>✦</span><b>Ask Luuba AI</b></button>
    {chatOpen ? <aside className="assistant" id="sales-assistant" aria-label="Luuba AI sales assistant">
      <header><div><span>✦</span><p><b>Luuba AI</b><small>Sales assistant</small></p></div><button type="button" onClick={() => setChatOpen(false)} aria-label="Close assistant">×</button></header>
      <div className="assistant-messages" aria-live="polite">{messages.map((message, index) => <p className={message.role} key={`${message.role}-${index}`}>{message.content}</p>)}{chatBusy ? <p className="assistant typing">Thinking…</p> : null}</div>
      <div className="quick-prompts">{["Compare Express and EG125", "What can I buy for UGX 6m?", "How does the loan enquiry work?"].map((prompt) => <button key={prompt} onClick={() => setChatInput(prompt)}>{prompt}</button>)}</div>
      <form onSubmit={sendChat}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Ask about models or prices…" aria-label="Message Luuba AI"/><button disabled={!chatInput.trim() || chatBusy} aria-label="Send message">➤</button></form>
      <small className="assistant-note">AI can make mistakes. Confirm prices and loan terms with our sales team.</small>
    </aside> : null}
  </main>;
}
