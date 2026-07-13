type Props = {
    children: React.ReactNode;
};

export default function SetupCard({
    children,
}: Props) {
    return (
        <div className="mx-auto mt-16 max-w-3xl rounded-xl border border-border bg-card p-10 shadow-sm">
            {children}
        </div>
    );
}