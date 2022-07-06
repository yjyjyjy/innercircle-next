import { Box, Tag, TagLabel, useId } from "@chakra-ui/react"

export const FilterTag = ({
    label,
    startDate = null,
    isChecked = false,
    colorTheme = "blue",
    onClick,
}) => {
    const key = useId()
    return (
        <Box p={2} key={key}>
            <Tag
                size={"lg"}
                onClick={onClick}
                variant={isChecked ? "solid" : "outline"}
                colorScheme={colorTheme}
                _hover={{ cursor: "pointer", bg: colorTheme + ".100" }}
            >
                <TagLabel>
                    {label}
                    {startDate && " (" + startDate + ")"}
                </TagLabel>
            </Tag>
        </Box>
    )
}
