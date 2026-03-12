import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "50px", color: "red", background: "white", zIndex: 9999, position: "relative", minHeight: "100vh" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Something went wrong.</h1>
                    <details style={{ whiteSpace: "pre-wrap", background: "#f8f8f8", padding: "20px", border: "1px solid #ddd" }}>
                        <summary style={{ cursor: "pointer", fontWeight: "bold", marginBottom: "10px" }}>Click to view exactly which line crashed</summary>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo?.componentStack}
                    </details>
                    <button
                        onClick={() => window.location.href = '/'}
                        style={{ marginTop: "20px", padding: "10px 20px", background: "#f3a847", border: "1px solid #a88734", borderRadius: "3px", cursor: "pointer" }}>
                        Go Back Home
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
