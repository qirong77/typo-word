export function GithubIcon() {
    return (
        <div onClick={() => window.open("https://github.com/qirong77/typo-word", "_blank")}>
            <img src="../../../public/assets/github-mark-white.png" alt="github" className="w-8 h-8 cursor-pointer opacity-50" />
        </div>
    );
}
