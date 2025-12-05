export default function SnackBar() {
    return (
        <div className="flex items-center gap-2 bg-background rounded-2xl px-4 py-3 border border-border w-fit justify-center mx-auto">
            <img src="/snack.svg" alt="Snackbar" className="w-5 h-5" />
            <p className="text-xs font-medium text-dark">Welcome to SpeakPeak, Alex. You can start speaking</p>
        </div>
    );
}
