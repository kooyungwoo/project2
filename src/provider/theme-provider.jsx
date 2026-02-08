import { useEffect, useState, useMemo } from "react"
import PropTypes from "prop-types"
import { ThemeProviderContext } from "@/context/theme-context"

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  )

  useEffect(() => {
    // window 대신 globalThis 사용 권장
    const root = globalThis.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = globalThis.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  // useMemo 사용, theme이 바뀔 때만 객체가 새로 생성되어 하위 컴포넌트의 불필요한 리렌더링 방지
  const value = useMemo(() => ({
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }), [theme, storageKey])

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultTheme: PropTypes.string,
  storageKey: PropTypes.string,
}