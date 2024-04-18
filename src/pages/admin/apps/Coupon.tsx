import { FormEvent, useState } from "react";
import AdminAside from "../../../components/admin/AdminAside";

const allNumbers = "1234567890";
const allSymbols = "*&^%$#@!-+=?/><|";
const allAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const coupon = () => {
    const [size, setSize] = useState<number>(8);
    const [coupon, setCoupon] = useState<string>("");
    const [prefix, setPrefix] = useState<string>("");
    const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
    const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
    const [includeCharacters, setIncludeCharacters] = useState<boolean>(true);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    // COPY FUNCTION
    // =============
    const copyText = async (coupon: string) => {
        await window.navigator.clipboard.writeText(coupon);
        setIsCopied(true);
    };
    // GENERATED ONCLICK FUNCTION
    // ==========================
    const formSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Clearing old value of coupon
        setCoupon("");
        // Checking the selected fields
        if (!includeCharacters && !includeNumbers && !includeSymbols) {
            return alert("Please select at least one from Characters, Numbers and Symbols");
        }
        // making a string which is used for generating coupon
        let entireCharsForCoupon: string = "";
        if (includeNumbers) entireCharsForCoupon += allNumbers;
        if (includeSymbols) entireCharsForCoupon += allSymbols;
        if (includeCharacters) entireCharsForCoupon += allAlphabets;
        // generating coupon
        // =================
        let generatedCoupon: string = prefix || "";
        const loopLength: number = size - generatedCoupon.length;
        for (let i = 0; i < loopLength; i++) {
            const randomNumber: number = Math.floor(Math.random() * entireCharsForCoupon.length);
            generatedCoupon += entireCharsForCoupon[randomNumber];
        }
        // Set coupon value and making is copied false
        setCoupon(generatedCoupon);

        setIsCopied(false);
    };
    return (
        <div className="adminContainer">
            <AdminAside />
            <main className="couponContainer">
                <h2>Coupon</h2>
                <section>
                    <form className="couponForm" onSubmit={formSubmitHandler}>
                        <label htmlFor="prefix">Prefix</label>
                        <input
                            type="text"
                            id="prefix"
                            value={prefix}
                            maxLength={size}
                            placeholder="Text to include"
                            onChange={(e) => setPrefix(e.target.value)}
                        />
                        <label htmlFor="size">Prefix</label>
                        <input
                            type="number"
                            id="size"
                            value={size}
                            max={25}
                            min={8}
                            onChange={(e) => setSize(Number(e.target.value))}
                        />
                        <fieldset>
                            <legend>Include</legend>
                            <label htmlFor="characters">Characters</label>
                            <input
                                id="characters"
                                type="checkbox"
                                checked={includeCharacters}
                                onChange={() => setIncludeCharacters((prev) => !prev)}
                            />
                            <label htmlFor="numbers">Numbers</label>
                            <input
                                id="numbers"
                                type="checkbox"
                                checked={includeNumbers}
                                onChange={() => setIncludeNumbers((prev) => !prev)}
                            />
                            <label htmlFor="symbols">Symbols</label>
                            <input
                                id="symbols"
                                type="checkbox"
                                checked={includeSymbols}
                                onChange={() => setIncludeSymbols((prev) => !prev)}
                            />
                        </fieldset>
                        <button type="submit">Generate Coupon</button>
                    </form>
                    {coupon ? (
                        <output onClick={() => copyText(coupon)}>
                            {coupon} <span>{isCopied ? "Copied" : "Copy"}</span>
                        </output>
                    ) : null}
                </section>
            </main>
        </div>
    );
};

export default coupon;
