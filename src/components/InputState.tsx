type StatItemProps = {
    label: string;
    value: string | number;
};

function StatItem({ label, value }: StatItemProps) {
    return (
        <div className=" flex justify-center items-center flex-col" style={{
            padding:'10px 30px',
        }}>
            <div className=" text-slate-500">{value}</div>
            <div className=" text-slate-500">{label}</div>
        </div>
    );
}

export function InputStateBoard(props: { count: number; errorCout: number; timeElapsed: string; accuracy: number }) {
    return (
        <div className=" flex justify-around  bg-slate-800 rounded-lg " style={{marginBottom:'100px'}}>
            <StatItem label="时间" value={props.timeElapsed} />
            <StatItem label="输入数" value={props.count} />
            <StatItem label="正确数" value={props.count} />
            <StatItem label="正确率" value={`${props.accuracy}%`} />
        </div>
    );
}
