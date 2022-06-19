import React, { useEffect } from 'react'

export const useOutsideClick = (
  ref: React.MutableRefObject<any>,
  cb: () => void,
): void => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (ref.current !== null && !ref.current.contains(event.target)) {
        cb()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, cb])
}
