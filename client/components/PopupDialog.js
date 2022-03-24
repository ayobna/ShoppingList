import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';

const PopupDialog = (props) => {
    const { children, title, visible, cancel, confirm, resend, buttonConfirmTitle, buttonCancelTitle } = props;

    return (
        <Portal>
            <Dialog visible={visible} dismissable={false}>
                <Dialog.Title>{title}</Dialog.Title>
                {
                    children &&
                    <Dialog.Content>
                        {children}
                    </Dialog.Content>
                }
                <Dialog.Actions>
                    <Button onPress={cancel}>{buttonCancelTitle ? buttonCancelTitle : "ביטול"}</Button>
                    {
                        resend &&
                        <Button onPress={() => resend(true)}>שלח קוד חדש</Button>
                    }
                    <Button onPress={() => confirm(true)}>{buttonConfirmTitle ? buttonConfirmTitle : "אישור"}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );

};

const styles = StyleSheet.create({

});

export default PopupDialog;
