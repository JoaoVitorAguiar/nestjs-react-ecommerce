import ErrorPage from "@/errors/ErrorPage"
import { Component, type ReactNode } from "react"

type Props = {
    children: ReactNode
}

type State = {
    hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, info: any) {
        console.error("Application error:", error, info)
    }

    render() {

        if (this.state.hasError) {
            return <ErrorPage />
        }

        return this.props.children
    }
}