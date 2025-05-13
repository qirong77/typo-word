import GithubImage from "../../../public/assets/github-mark-white.png";
export function GithubIcon() {
    return (
        <div onClick={() => window.open("https://github.com/qirong77/typo-word", "_blank")}>
            <img src={GithubImage} alt="github" className="w-8 h-8 cursor-pointer opacity-50" />
        </div>
    );
}
