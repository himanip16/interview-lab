type Props = {
    children: React.ReactNode;
};

export default function SetupCard({
    children,
}: Props) {
    return (
        <div className="mx-auto mt-16 max-w-3xl rounded-xl border border-zinc-200 bg-white p-10 shadow-sm">
            {children}
        </div>
    );
}