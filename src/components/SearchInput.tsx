'use client'

import { KeyboardEvent, useCallback, useEffect } from 'react'
import { Container, Box, Paper, InputBase, IconButton, FormHelperText, Typography } from '@mui/material'

import { z } from 'zod'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import SearchIcon from '@mui/icons-material/Search'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

interface SearchInputProps {
  defaultValue?: string
  onChange(input: string): void
}

const searchSchema = z.object({
  searchInput: z
    .string()
    // .min(1, { message: 'Required' })
    .max(20, { message: 'Max length exceeded' })
    .regex(/^[a-zA-Z0-9 ]*$/, { message: 'Not allowed characters' })
    .describe('SearchInput is the search strign for user names.'),
})

type SearchInput = z.infer<typeof searchSchema>

const SearchInput = ({ defaultValue = '', onChange }: SearchInputProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    resetField,
    watch,
  } = useForm<SearchInput>({
    defaultValues: {
      searchInput: defaultValue,
    },
    resolver: zodResolver(searchSchema),
  })

  const searchInputWatch = watch('searchInput')

  const onSubmit: SubmitHandler<SearchInput> = (data) => onChange(data.searchInput)

  const onReset = useCallback(() => {
    resetField('searchInput', { defaultValue })
    handleSubmit(onSubmit)()
  }, [])

  const onEnterKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(onSubmit)()
    }
  }

  useEffect(() => {
    resetField('searchInput', { defaultValue })
  }, [defaultValue])

  return (
    <Container maxWidth="tablet">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        flexDirection="column"
        py={8}
        onKeyDown={onEnterKeyDownHandler}
      >
        <Paper
          component="form"
          sx={{ px: 1, py: 2, display: 'flex', alignItems: 'center', width: '100%' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box display="flex" flexDirection="row" alignItems="center" width="100%">
            <Box
              flex={1}
              sx={{
                position: 'relative',
              }}
            >
              <Controller
                name="searchInput"
                control={control}
                render={({ field }) => (
                  <InputBase
                    {...field}
                    sx={{ width: '100%', ml: 1, flex: 1 }}
                    placeholder="Search User"
                    inputProps={{ 'aria-label': 'search user input' }}
                    error={Boolean(errors.searchInput)}
                  />
                )}
              />

              {Boolean(errors.searchInput?.message) ? (
                <Paper
                  sx={{
                    position: 'absolute',
                    px: 1,
                    left: '8px',
                    bottom: '-24px',
                    opacity: '0.9',
                  }}
                >
                  <FormHelperText id="search-input-error-text">
                    <Typography variant="caption" color="error">
                      {errors.searchInput?.message}
                    </Typography>
                  </FormHelperText>
                </Paper>
              ) : null}
            </Box>

            {Boolean(searchInputWatch) ? (
              <IconButton type="reset" sx={{ p: 2 }} aria-label="reset input" onClick={onReset}>
                <CancelOutlinedIcon />
              </IconButton>
            ) : null}

            <IconButton type="submit" sx={{ p: 2 }} aria-label="search input">
              <SearchIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default SearchInput
