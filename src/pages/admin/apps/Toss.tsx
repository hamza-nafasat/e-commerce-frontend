import { useState } from "react";
import AdminAside from "../../../components/admin/AdminAside";

const Toss = () => {
	const [angle, setAngle] = useState<number>(0);
	const flipCoin = () => {
		if (Math.random() > 0.5) {
			setAngle((prev) => prev + 180);
		} else {
			setAngle((prev) => prev + 360);
		}
	};
	return (
		<div className="adminContainer">
			<AdminAside />
			<main className="tossCoinContainer">
				<h2>Toss</h2>
				<section>
					<article
						className="tossCoin"
						onClick={flipCoin}
						style={{ transform: `rotateY(${angle}deg)` }}
					>
						<div></div>
						<div></div>
					</article>
				</section>
			</main>
		</div>
	);
};

export default Toss;
