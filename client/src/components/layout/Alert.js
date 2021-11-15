import React from "react"
import { useSelector } from "react-redux"

const Alert = () => {
	const alerts = useSelector((state) => state.alert.value)

	if (alerts !== null)
		return (
			<div>
				{alerts.map((alert) => {
					return <div className={`alert alert-${alert.type}`}>{alert.msg}</div>
				})}
			</div>
		)

	return <div></div>
}

export default Alert
